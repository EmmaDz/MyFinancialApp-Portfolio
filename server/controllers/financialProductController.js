import FinancialProduct from '../models/financialProductModel.js';


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