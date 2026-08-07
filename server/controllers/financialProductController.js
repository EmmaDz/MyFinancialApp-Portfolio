import FinancialProduct from '../models/financialProductModel.js';   

export const createFinancialProduct = async (req, res) => {
    try {
        const { name, type, institution, interestRate, description, riskLevel, fee } = req.body;

        const newProduct = await FinancialProduct.create({
            name,
            type,
            institution,
            interestRate,
            description,
            riskLevel,
            fee
        });

        res.status(201).json({
            message: 'Financial product created successfully',
            data: newProduct
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating financial product',
            error: error.message
        });
    }
};

export const queryFinancialProductsByType = async (req, res) => {
    try {
        const { type } = req.query;

        const products = await FinancialProduct.findAll({
            where: {
                type: type
            }
        });

        res.status(200).json({
            message: `Financial products of type ${type} fetched successfully`,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error querying financial products by type',
            error: error.message
        });
    }
};

export const queryFinancialProductsByTypes = async (req, res) => {
    try {
        const { types } = req.query;

        const typesArray = types ? types.split(',') : [];

        const products = await FinancialProduct.findAll({
            where: {
                type: typesArray
            }
        });
        res.status(200).json({
            message: 'Financial products fetched successfully for specified types',
            data: products
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error querying financial products by types',
            error: error.message
        });
    }
};
