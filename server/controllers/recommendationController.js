import { Op } from 'sequelize';
import sequelize from '../config/db.js';
import FinancialProduct
    from '../models/financialProductModel.js';

import Portfolio
    from '../models/portfolioModel.js';

import Recommendation
    from '../models/recommendationModel.js';

import {
    generateProductAllocations,
} from '../services/recommendationService.js';

import RiskManage
    from '../models/RiskManageModel.js';

import {
    isRiskCompatible,
} from '../services/productMatchingService.js';


export const generateAndSaveRecommendation =
    async (req, res) => {
        try {
            const userId = req.userId;

            const {
                productIds,
            } = req.body;


            if (
                !Array.isArray(productIds) ||
                productIds.length === 0
            ) {
                return res.status(400).json({
                    message:
                        'Invalid or missing product selection.',
                });
            }


            const uniqueProductIds =
                [
                    ...new Set(
                        productIds
                    ),
                ];


            const portfolio =
                await Portfolio.findOne({
                    where: {
                        userId,
                    },
                });

            if (!portfolio) {
                return res.status(404).json({
                    message:
                        'No portfolio found for this user.',
                });
            }

            const latestAssessment =
                await RiskManage.findOne({
                    where: {
                        userId,
                    },

                    order: [
                        [
                            'assessmentDate',
                            'DESC',
                        ],
                    ],
                });

            if (!latestAssessment) {
                return res.status(404).json({
                    message:
                        'No risk assessment found for this user.',
                });
            }

            const products =
                await FinancialProduct.findAll({
                    where: {
                        id: {
                            [Op.in]:
                                uniqueProductIds,
                        },
                    },
                });

            if (
                products.length !==
                uniqueProductIds.length
            ) {
                return res.status(400).json({
                    message:
                        'One or more selected financial products do not exist.',
                });
            }


            const incompatibleProduct =
                products.find(
                    product =>
                        !isRiskCompatible(
                            latestAssessment.riskLevel,
                            product.riskLevel
                        )
                );

            if (incompatibleProduct) {
                return res.status(400).json({
                    message:
                        `Selected product "${incompatibleProduct.name}" is not compatible with the current risk profile.`,
                });
            }


            const allocations =
                generateProductAllocations(
                    portfolio,
                    products
                );


            const transaction =
                await sequelize.transaction();

            try {
                await Recommendation.destroy({
                    where: {
                        userId,
                    },
                    transaction,
                });


                for (
                    const allocation of
                    allocations
                ) {
                    await Recommendation.create(
                        {
                            userId,

                            productId:
                                allocation.productId,

                            investmentProportion:
                                allocation
                                    .investmentProportion,
                        },
                        {
                            transaction,
                        }
                    );
                }

                await transaction.commit();
            } catch (error) {
                await transaction.rollback();

                throw error;
            }

            const savedRecommendations =
                await Recommendation.findAll({
                    where: {
                        userId,
                    },

                    include: {
                        model: FinancialProduct,
                        as: 'product',
                    },

                    order: [
                        ['id', 'ASC'],
                    ],
                });

            return res.status(200).json({
                message:
                    'Recommendation generated and saved successfully',
                data:
                    savedRecommendations,
            });
        } catch (error) {
            console.error(
                'Error processing recommendation:',
                error
            );

            if (
                error.message.includes(
                    'must be selected'
                ) ||
                error.message.includes(
                    'Unsupported asset class'
                )
            ) {
                return res.status(400).json({
                    error:
                        error.message,
                });
            }


            return res.status(500).json({
                error:
                    'Failed to process recommendation request.',
            });
        }
    };

export const getAllRecommendations = async (req, res) => {
    try {
        const userId = req.userId;

        // Fetch all recommendations for the logged-in user
        const recommendations =
            await Recommendation.findAll({
                where: {
                    userId,
                },

                include: {
                    model: FinancialProduct,
                    as: 'product',
                },

                order: [
                    ['id', 'ASC'],
                ],
            });

        res.status(200).json({
            message: 'Recommendations fetched successfully',
            data: recommendations
        });
    } catch (error) {
        console.error("Error in fetching recommendations:", error);

        return res.status(500).json({ error: 'Failed to fetch recommendations.' });
    }
};

