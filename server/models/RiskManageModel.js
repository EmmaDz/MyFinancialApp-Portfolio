import Sequelize from 'sequelize';
import sequelize from '../config/db.js';

const RiskManage = sequelize.define(
    'risk_manage',
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

        riskLevel: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        timeHorizonProfile: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        investmentKnowledgeProfile: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        investmentObjectiveProfile: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        riskCapacityScore: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },

        riskCapacityProfile: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        riskToleranceScore: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },

        riskToleranceProfile: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        assessmentDate: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
        },
    },
    {
        timestamps: false,
    }
);

export default RiskManage;