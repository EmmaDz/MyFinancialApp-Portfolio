import Portfolio from '../models/portfolioModel.js';
import {
    getPortfolioAllocation,
} from '../services/portfolioAllocationService.js';


// Create or update a user's portfolio
export const submitPortfolio = async (req, res) => {
    try {
        const userId =
            req.userId;

        const { riskLevel } = req.body;

        if (!riskLevel) {
            return res.status(400).json({
                error: 'Risk level is required',
            });
        }

        const allocation =
            getPortfolioAllocation(
                riskLevel
            );

        let portfolio =
            await Portfolio.findOne({
                where: { userId },
            });

        if (portfolio) {
            await portfolio.update({
                equity:
                    allocation.equity,

                fixedIncome:
                    allocation.fixedIncome,

                cashEquivalent:
                    allocation.cashEquivalent,

                riskLevel:
                    allocation.riskLevel,
            });

            return res.json({
                message:
                    'Portfolio updated successfully',

                portfolio,
            });
        }

        portfolio =
            await Portfolio.create({
                userId,

                equity:
                    allocation.equity,

                fixedIncome:
                    allocation.fixedIncome,

                cashEquivalent:
                    allocation.cashEquivalent,

                riskLevel:
                    allocation.riskLevel,
            });

        return res.status(201).json({
            message:
                'Portfolio created successfully',

            portfolio,
        });
    } catch (error) {
        if (error.statusCode) {
            return res
                .status(error.statusCode)
                .json({
                    error:
                        error.message,
                });
        }

        if (
            error.message.startsWith(
                'Invalid risk level:'
            )
        ) {
            return res.status(400).json({
                error:
                    error.message,
            });
        }

        console.error(
            'Portfolio submission error:',
            error
        );

        return res.status(500).json({
            error:
                'Failed to process portfolio request.',
        });
    }
};


// Retrieve the current user's portfolio
export const getPortfolioByUserId =
    async (req, res) => {
        try {
            const userId =
                req.userId;

            const portfolio =
                await Portfolio.findOne({
                    where: { userId },
                });

            if (!portfolio) {
                return res.status(404).json({
                    message:
                        'No portfolio found for this user.',
                });
            }

            return res.json({
                portfolio,
            });
        } catch (error) {
            if (error.statusCode) {
                return res
                    .status(error.statusCode)
                    .json({
                        error:
                            error.message,
                    });
            }

            console.error(
                'Portfolio retrieval error:',
                error
            );

            return res.status(500).json({
                error:
                    'Failed to retrieve portfolio.',
            });
        }
    };