import Sequelize from 'sequelize';
import sequelize from '../config/db.js';

const FinancialProduct = sequelize.define(
    'financialProduct',
    {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        assetClass: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        productType: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        institution: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        interestRate: {
            type: Sequelize.DECIMAL(5, 2),
            allowNull: true,
        },

        description: {
            type: Sequelize.TEXT,
            allowNull: true,
        },

        riskLevel: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        fee: {
            type: Sequelize.DECIMAL(5, 2),
            allowNull: true,
            defaultValue: 0,
        },
    },
    {
        tableName: 'financialProducts',
        timestamps: false,
    }
);

export default FinancialProduct;