import test, {
    before,
    beforeEach,
    after,
} from 'node:test';

import assert
    from 'node:assert/strict';

import request
    from 'supertest';

import jwt
    from 'jsonwebtoken';

import app
    from '../../app.js';

import sequelize
    from '../../config/db.js';

import User
    from '../../models/userModel.js';

import RiskManage
    from '../../models/RiskManageModel.js';


let user;
let token;


before(
    async () => {
        await sequelize.sync({
            force: true,
        });


        user =
            await User.create({
                name:
                    'Questionnaire Integration User',

                email:
                    'questionnaire-integration@example.com',

                password:
                    'test-password',
            });


        token =
            jwt.sign(
                {
                    id: user.id,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn:
                        '1h',
                }
            );
    }
);

beforeEach(
    async () => {
        await RiskManage.destroy({
            where: {},
        });
    }
);

const highRiskAnswers = {
    Q1: 'E',
    Q2: 'C',
    Q3: 'D',

    Q4: 'F',
    Q5: 'A',
    Q6: 'E',
    Q7: 'F',
    Q8: 'A',
    Q9: 'A',

    Q10: 'D',
    Q11: 'E',
    Q12: 'D',
    Q13: 'D',
    Q14: 'D',
    Q15: 'D',
};

test(
    'POST /api/questionnaire/submit-quiz should save a valid risk assessment',
    async () => {
        const response =
            await request(app)
                .post(
                    '/api/questionnaire/submit-quiz'
                )
                .set(
                    'Authorization',
                    `Bearer ${token}`
                )
                .send(
                    highRiskAnswers
                );


        assert.equal(
            response.status,
            201
        );


        assert.equal(
            response.body.message,
            'Risk assessment completed successfully'
        );


        assert.equal(
            response.body.assessment.riskLevel,
            'Aggressive Growth'
        );


        assert.equal(
            response.body.assessment.riskCapacityScore,
            68
        );


        assert.equal(
            response.body.assessment.riskToleranceScore,
            60
        );


        const savedAssessment =
            await RiskManage.findOne({
                where: {
                    userId:
                        user.id,
                },
            });


        assert.ok(
            savedAssessment
        );


        assert.equal(
            savedAssessment.riskLevel,
            'Aggressive Growth'
        );


        assert.equal(
            savedAssessment.riskCapacityScore,
            68
        );


        assert.equal(
            savedAssessment.riskToleranceScore,
            60
        );
    }
);

test(
    'POST /api/questionnaire/submit-quiz should use the most conservative dimension as final risk level',
    async () => {
        const answers = {
            ...highRiskAnswers,
            Q1: 'B',
        };


        const response =
            await request(app)
                .post(
                    '/api/questionnaire/submit-quiz'
                )
                .set(
                    'Authorization',
                    `Bearer ${token}`
                )
                .send(
                    answers
                );


        assert.equal(
            response.status,
            201
        );


        assert.equal(
            response.body.assessment
                .timeHorizonProfile,
            'Conservative'
        );


        assert.equal(
            response.body.assessment
                .riskLevel,
            'Conservative'
        );


        const savedAssessment =
            await RiskManage.findOne({
                where: {
                    userId:
                        user.id,
                },
            });


        assert.equal(
            savedAssessment.riskLevel,
            'Conservative'
        );
    }
);

test(
    'POST /api/questionnaire/submit-quiz should reject incomplete answers without creating assessment',
    async () => {
        const incompleteAnswers = {
            ...highRiskAnswers,
        };


        delete incompleteAnswers.Q7;


        const countBefore =
            await RiskManage.count();


        const response =
            await request(app)
                .post(
                    '/api/questionnaire/submit-quiz'
                )
                .set(
                    'Authorization',
                    `Bearer ${token}`
                )
                .send(
                    incompleteAnswers
                );


        assert.equal(
            response.status,
            400
        );


        assert.match(
            response.body.error,
            /Missing answer for Q7/
        );


        const countAfter =
            await RiskManage.count();


        assert.equal(
            countAfter,
            countBefore
        );
    }
);

test(
    'GET /api/questionnaire/risk-level should return the latest assessment',
    async () => {
        await RiskManage.create({
            userId:
                user.id,

            riskLevel:
                'Conservative',

            timeHorizonProfile:
                'Conservative',

            investmentKnowledgeProfile:
                'Growth',

            investmentObjectiveProfile:
                'Growth',

            riskCapacityScore:
                20,

            riskCapacityProfile:
                'Balanced',

            riskToleranceScore:
                35,

            riskToleranceProfile:
                'Growth',

            assessmentDate:
                new Date(
                    '2026-01-01T10:00:00Z'
                ),
        });


        await RiskManage.create({
            userId:
                user.id,

            riskLevel:
                'Balanced',

            timeHorizonProfile:
                'Growth',

            investmentKnowledgeProfile:
                'Growth',

            investmentObjectiveProfile:
                'Growth',

            riskCapacityScore:
                24,

            riskCapacityProfile:
                'Balanced',

            riskToleranceScore:
                35,

            riskToleranceProfile:
                'Growth',

            assessmentDate:
                new Date(
                    '2026-02-01T10:00:00Z'
                ),
        });


        const response =
            await request(app)
                .get(
                    '/api/questionnaire/risk-level'
                )
                .set(
                    'Authorization',
                    `Bearer ${token}`
                );


        assert.equal(
            response.status,
            200
        );


        assert.equal(
            response.body.riskLevel,
            'Balanced'
        );


        assert.equal(
            response.body.riskCapacityScore,
            24
        );
    }
);

after(
    async () => {
        await sequelize.close();
    }
);