import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

import FinancialProduct
    from '../models/financialProductModel.js';

import Portfolio
    from '../models/portfolioModel.js';

import Recommendation
    from '../models/recommendationModel.js';

import {
    generateProductAllocations,
} from '../services/recommendationService.js';


export const generateAndSaveRecommendation =
    async (req, res) => {
        const token =
            req.headers.authorization
                ?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                error:
                    'Authorization token required',
            });
        }

        try {
            const decoded =
                jwt.verify(
                    token,
                    process.env.JWT_SECRET
                );

            const userId =
                decoded.id;

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


            const allocations =
                generateProductAllocations(
                    portfolio,
                    products
                );


            await Recommendation.destroy({
                where: {
                    userId,
                },
            });


            const recommendations = [];


            for (
                const allocation of
                allocations
            ) {
                const recommendation =
                    await Recommendation.create({
                        userId,

                        productId:
                            allocation.productId,

                        investmentProportion:
                            allocation.investmentProportion,
                    });

                recommendations.push(
                    recommendation
                );
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
                error.name ===
                'TokenExpiredError'
            ) {
                return res.status(401).json({
                    error:
                        'Token has expired',
                });
            }


            if (
                error.name ===
                'JsonWebTokenError'
            ) {
                return res.status(401).json({
                    error:
                        'Invalid token',
                });
            }


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
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Authorization token required" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

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
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        } else {
            return res.status(500).json({ error: 'Failed to fetch recommendations.' });
        }
    }
};

