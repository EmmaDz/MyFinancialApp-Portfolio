import FinancialProduct from '../models/financialProductModel.js';
import RiskManage from '../models/RiskManageModel.js';
import {
    filterCompatibleProducts,
} from '../services/productMatchingService.js';

export const createFinancialProduct = async (req, res) => {
    try {
        const {
            name,
            assetClass,
            productType,
            institution,
            interestRate,
            description,
            riskLevel,
            fee,
        } = req.body;

        if (
            !name ||
            !assetClass ||
            !productType ||
            !institution ||
            !riskLevel
        ) {
            return res.status(400).json({
                message:
                    'Name, asset class, product type, institution, and risk level are required.',
            });
        }

        const newProduct =
            await FinancialProduct.create({
                name,
                assetClass,
                productType,
                institution,
                interestRate:
                    interestRate === '' ||
                    interestRate == null
                        ? null
                        : interestRate,
                description:
                    description || null,
                riskLevel,
                fee:
                    fee === '' ||
                    fee == null
                        ? 0
                        : fee,
            });

        return res.status(201).json({
            message:
                'Financial product created successfully',
            data: newProduct,
        });
    } catch (error) {
        console.error(
            'Financial product creation error:',
            error
        );

        return res.status(500).json({
            message:
                'Error creating financial product',
        });
    }
};


export const queryFinancialProducts =
    async (req, res) => {
        try {
            const {
                assetClass,
                productType,
                riskLevel,
            } = req.query;

            const where = {};

            if (assetClass) {
                where.assetClass = assetClass;
            }

            if (productType) {
                where.productType = productType;
            }

            if (riskLevel) {
                where.riskLevel = riskLevel;
            }

            const products =
                await FinancialProduct.findAll({
                    where,
                    order: [
                        ['assetClass', 'ASC'],
                        ['name', 'ASC'],
                    ],
                });

            return res.status(200).json({
                message:
                    'Financial products fetched successfully',
                data: products,
            });
        } catch (error) {
            console.error(
                'Financial product query error:',
                error
            );

            return res.status(500).json({
                message:
                    'Error querying financial products',
            });
        }
    };

    export const queryCompatibleFinancialProducts =
    async (req, res) => {
        try {
            const userId =
                req.userId;

            const {
                assetClass,
            } = req.query;


            if (!assetClass) {
                return res.status(400).json({
                    message:
                        'Asset class is required.',
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
                        assetClass,
                    },

                    order: [
                        ['name', 'ASC'],
                    ],
                });


            const compatibleProducts =
                filterCompatibleProducts(
                    latestAssessment.riskLevel,
                    products
                );


            return res.status(200).json({
                message:
                    'Compatible financial products fetched successfully',

                riskLevel:
                    latestAssessment.riskLevel,

                data:
                    compatibleProducts,
            });
        } catch (error) {
            console.error(
                'Compatible financial product query error:',
                error
            );


            if (error.statusCode) {
                return res
                    .status(
                        error.statusCode
                    )
                    .json({
                        error:
                            error.message,
                    });
            }


            return res.status(500).json({
                message:
                    'Error querying compatible financial products',
            });
        }
    };