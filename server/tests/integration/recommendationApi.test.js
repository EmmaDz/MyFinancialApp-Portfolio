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

import FinancialProduct
    from '../../models/financialProductModel.js';

import Recommendation
    from '../../models/recommendationModel.js';

import Portfolio
    from '../../models/portfolioModel.js';

import RiskManage
    from '../../models/RiskManageModel.js';

let token;
let user;
let otherUser;

let balancedEquityProduct;
let growthEquityProduct;
let fixedIncomeProduct;
let cashProduct;


before(
    async () => {
        await sequelize.sync({
            force: true,
        });


        user =
            await User.create({
                name:
                    'Integration Test User',
                email:
                    'integration@example.com',
                password:
                    'test-password',
            });


         otherUser =
            await User.create({
                name:
                    'Other Integration User',

                email:
                    'other-integration@example.com',

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
                    expiresIn: '1h',
                }
            );


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
                new Date(),
        });        


        await Portfolio.create({
            userId:
                user.id,

            riskLevel:
                'Balanced',

            equity:
                50,

            fixedIncome:
                45,

            cashEquivalent:
                5,
        });

        balancedEquityProduct =
            await FinancialProduct.create({
                name:
                    'Integration Balanced Equity',

                assetClass:
                    'Equity',

                productType:
                    'ETF',

                institution:
                    'Test Institution',

                interestRate:
                    null,

                description:
                    'Integration test equity product',

                riskLevel:
                    'Balanced',

                fee:
                    0.25,
            });


        growthEquityProduct =
            await FinancialProduct.create({
                name:
                    'Integration Growth Equity',

                assetClass:
                    'Equity',

                productType:
                    'ETF',

                institution:
                    'Test Institution',

                interestRate:
                    null,

                description:
                    'Incompatible integration test product',

                riskLevel:
                    'Growth',

                fee:
                    0.30,
            });


        fixedIncomeProduct =
            await FinancialProduct.create({
                name:
                    'Integration Bond Fund',

                assetClass:
                    'Fixed Income',

                productType:
                    'Bond Fund',

                institution:
                    'Test Institution',

                interestRate:
                    null,

                description:
                    'Integration test bond product',

                riskLevel:
                    'Conservative',

                fee:
                    0.20,
            });


        cashProduct =
            await FinancialProduct.create({
                name:
                    'Integration Cash Product',

                assetClass:
                    'Cash Equivalent',

                productType:
                    'Money Market Fund',

                institution:
                    'Test Institution',

                interestRate:
                    null,

                description:
                    'Integration test cash product',

                riskLevel:
                    'Very Conservative',

                fee:
                    0.10,
            });
    }
);

beforeEach(
    async () => {
        await Recommendation.destroy({
            where: {},
        });
    }
);

after(
    async () => {
        await sequelize.close();
    }
);


test(
    'POST /api/recommendations/generate should create valid recommendations',
    async () => {
        const response =
            await request(app)
                .post(
                    '/api/recommendations/generate'
                )
                .set(
                    'Authorization',
                    `Bearer ${token}`
                )
                .send({
                    productIds: [
                        balancedEquityProduct.id,
                        fixedIncomeProduct.id,
                        cashProduct.id,
                    ],
                });


        assert.equal(
            response.status,
            200
        );


        assert.equal(
            response.body.data.length,
            3
        );


        const total =
            response.body.data.reduce(
                (
                    sum,
                    recommendation
                ) =>
                    sum +
                    Number(
                        recommendation
                            .investmentProportion
                    ),
                0
            );


        assert.equal(
            total,
            100
        );


        const allocations =
            Object.fromEntries(
                response.body.data.map(
                    recommendation => [
                        recommendation.product.assetClass,
                        Number(
                            recommendation
                                .investmentProportion
                        ),
                    ]
                )
            );


        assert.equal(
            allocations.Equity,
            50
        );

        assert.equal(
            allocations['Fixed Income'],
            45
        );

        assert.equal(
            allocations['Cash Equivalent'],
            5
        );
    }
);


test(
    'POST /api/recommendations/generate should reject incompatible product without deleting existing recommendations',
    async () => {
        await Recommendation.create({
            userId:
                user.id,

            productId:
                fixedIncomeProduct.id,

            investmentProportion:
                100,
        });


        const beforeRecommendations =
            await Recommendation.findAll({
                where: {
                    userId:
                        user.id,
                },
                order: [
                    ['id', 'ASC'],
                ],
                raw: true,
            });


        const response =
            await request(app)
                .post(
                    '/api/recommendations/generate'
                )
                .set(
                    'Authorization',
                    `Bearer ${token}`
                )
                .send({
                    productIds: [
                        growthEquityProduct.id,
                        fixedIncomeProduct.id,
                        cashProduct.id,
                    ],
                });


        assert.equal(
            response.status,
            400
        );


        assert.match(
            response.body.message,
            /not compatible/
        );


        const afterRecommendations =
            await Recommendation.findAll({
                where: {
                    userId:
                        user.id,
                },
                order: [
                    ['id', 'ASC'],
                ],
                raw: true,
            });


        assert.deepEqual(
            afterRecommendations,
            beforeRecommendations
        );
    }
);


test(
    'POST /api/recommendations/generate should replace previous recommendations',
    async () => {
        await Recommendation.create({
            userId:
                user.id,

            productId:
                fixedIncomeProduct.id,

            investmentProportion:
                100,
        });

        const oldRecommendations =
            await Recommendation.findAll({
                where: {
                    userId:
                        user.id,
                },

                raw: true,
            });

        assert.equal(
            oldRecommendations.length,
            1
        );


        const oldRecommendationId =
            oldRecommendations[0].id;


        const response =
            await request(app)
                .post(
                    '/api/recommendations/generate'
                )
                .set(
                    'Authorization',
                    `Bearer ${token}`
                )
                .send({
                    productIds: [
                        balancedEquityProduct.id,
                        fixedIncomeProduct.id,
                        cashProduct.id,
                    ],
                });


        assert.equal(
            response.status,
            200
        );


        const newRecommendations =
            await Recommendation.findAll({
                where: {
                    userId:
                        user.id,
                },

                order: [
                    ['id', 'ASC'],
                ],

                raw: true,
            });


        assert.equal(
            newRecommendations.length,
            3
        );


        assert.equal(
            newRecommendations.some(
                recommendation =>
                    recommendation.id ===
                    oldRecommendationId
            ),
            false
        );
    }
);


test(
    'POST /api/recommendations/generate should reject nonexistent product without changing existing recommendations',
    async () => {
        await Recommendation.create({
            userId:
                user.id,

            productId:
                fixedIncomeProduct.id,

            investmentProportion:
                100,
        });


        const beforeRecommendations =
            await Recommendation.findAll({
                where: {
                    userId:
                        user.id,
                },

                raw: true,
            });


        const nonexistentProductId =
            999999;


        const response =
            await request(app)
                .post(
                    '/api/recommendations/generate'
                )
                .set(
                    'Authorization',
                    `Bearer ${token}`
                )
                .send({
                    productIds: [
                        balancedEquityProduct.id,
                        fixedIncomeProduct.id,
                        nonexistentProductId,
                    ],
                });


        assert.equal(
            response.status,
            400
        );


        assert.equal(
            response.body.message,
            'One or more selected financial products do not exist.'
        );


        const afterRecommendations =
            await Recommendation.findAll({
                where: {
                    userId:
                        user.id,
                },

                raw: true,
            });


        assert.deepEqual(
            afterRecommendations,
            beforeRecommendations
        );
    }
);

test(
    'GET /api/recommendations/list should return current user recommendations',
    async () => {
        await Recommendation.create({
            userId:
                user.id,

            productId:
                fixedIncomeProduct.id,

            investmentProportion:
                100,
        });


        const response =
            await request(app)
                .get(
                    '/api/recommendations/list'
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
            response.body.data.length,
            1
        );

        assert.equal(
            response.body.data[0]
                .productId,
            fixedIncomeProduct.id
        );

        assert.equal(
            response.body.data[0]
                .product.name,
            fixedIncomeProduct.name
        );
    }
);


test(
    'GET /api/recommendations/list should return only the current user recommendations',
    async () => {
        await Recommendation.create({
            userId:
                user.id,

            productId:
                fixedIncomeProduct.id,

            investmentProportion:
                100,
        });


        await Recommendation.create({
            userId:
                otherUser.id,

            productId:
                cashProduct.id,

            investmentProportion:
                100,
        });


        const response =
            await request(app)
                .get(
                    '/api/recommendations/list'
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
            response.body.data.length,
            1
        );


        assert.equal(
            response.body.data[0]
                .userId,
            user.id
        );


        assert.equal(
            response.body.data[0]
                .productId,
            fixedIncomeProduct.id
        );
    }
);


test(
    'GET /api/recommendations/list should reject request without token',
    async () => {
        const response =
            await request(app)
                .get(
                    '/api/recommendations/list'
                );


        assert.equal(
            response.status,
            401
        );


        assert.equal(
            response.body.error,
            'Authorization token required'
        );
    }
);