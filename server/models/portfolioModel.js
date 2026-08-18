import Sequelize from 'sequelize';
import sequelize from '../config/db.js';

const Portfolio = sequelize.define(
    'portfolios',
    {
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },

        equity: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0.0,
        },

        fixedIncome: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0.0,
        },

        cashEquivalent: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0.0,
        },

        riskLevel: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

export default Portfolio;