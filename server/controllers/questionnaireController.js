import RiskManage from '../models/RiskManageModel.js';
import { calculateRiskProfile } from '../services/riskProfileService.js';

const submitQuiz = async (req, res) => {
    try {
        // -----------------------------------------
        // 1. Get current user's user id
        // -----------------------------------------
        const userId = req.userId;


        // -----------------------------------------
        // 2. Calculate the risk profile
        // -----------------------------------------

        const riskProfile = calculateRiskProfile(
            req.body
        );


        // -----------------------------------------
        // 3. Save the assessment
        // -----------------------------------------

        const assessment = await RiskManage.create({
            userId,

            riskLevel:
                riskProfile.riskLevel,

            timeHorizonProfile:
                riskProfile.timeHorizonProfile,

            investmentKnowledgeProfile:
                riskProfile.investmentKnowledgeProfile,

            investmentObjectiveProfile:
                riskProfile.investmentObjectiveProfile,

            riskCapacityScore:
                riskProfile.riskCapacityScore,

            riskCapacityProfile:
                riskProfile.riskCapacityProfile,

            riskToleranceScore:
                riskProfile.riskToleranceScore,

            riskToleranceProfile:
                riskProfile.riskToleranceProfile,

            assessmentDate: new Date(),
        });


        // -----------------------------------------
        // 4. Return the calculated result
        // -----------------------------------------

        return res.status(201).json({
            message:
                'Risk assessment completed successfully',

            assessment: {
                id: assessment.id,

                riskLevel:
                    assessment.riskLevel,

                timeHorizonProfile:
                    assessment.timeHorizonProfile,

                investmentKnowledgeProfile:
                    assessment.investmentKnowledgeProfile,

                investmentObjectiveProfile:
                    assessment.investmentObjectiveProfile,

                riskCapacityScore:
                    assessment.riskCapacityScore,

                riskCapacityProfile:
                    assessment.riskCapacityProfile,

                riskToleranceScore:
                    assessment.riskToleranceScore,

                riskToleranceProfile:
                    assessment.riskToleranceProfile,

                assessmentDate:
                    assessment.assessmentDate,
            },
        });
    } catch (error) {
        // Validation errors thrown by
        // calculateRiskProfile()
        if (
            error.message.startsWith('Missing answer') ||
            error.message.startsWith(
                'Invalid or missing answer'
            ) ||
            error.message.startsWith(
                'Invalid answer'
            )
        ) {
            return res.status(400).json({
                error: error.message,
            });
        }

        console.error(
            'Error processing risk assessment:',
            error
        );

        return res.status(500).json({
            error:
                'Unable to process risk assessment.',
        });
    }
};


const getRiskLevel = async (req, res) => {
    try {
        const userId = req.userId;

        const riskInfo =
            await RiskManage.findOne({
                where: {
                    userId,
                },

                attributes: [
                    'riskLevel',

                    'timeHorizonProfile',
                    'investmentKnowledgeProfile',
                    'investmentObjectiveProfile',

                    'riskCapacityScore',
                    'riskCapacityProfile',

                    'riskToleranceScore',
                    'riskToleranceProfile',

                    'assessmentDate',
                ],

                order: [
                    ['assessmentDate', 'DESC'],
                ],
            });


        if (!riskInfo) {
            return res.status(404).json({
                error:
                    'No risk assessment found for this user.',
            });
        }

        return res.json(riskInfo);
    } catch (error) {
        console.error(
            'Error fetching risk information:',
            error
        );

        return res.status(500).json({
            error:
                'Unable to fetch risk information.',
        });
    }
};


export {
    submitQuiz,
    getRiskLevel,
};