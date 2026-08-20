import Sequelize from 'sequelize';
import sequelize from '../config/db.js';

const Recommendation = sequelize.define(
    'recommendations',
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

        productId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'financialProducts',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },

        investmentProportion: {
            type: Sequelize.DECIMAL(5, 2),
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

export default Recommendation;