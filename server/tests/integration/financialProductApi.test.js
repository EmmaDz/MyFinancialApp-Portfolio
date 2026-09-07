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

import FinancialProduct
    from '../../models/financialProductModel.js';


let balancedUser;
let balancedToken;

let conservativeUser;
let conservativeToken;

let conservativeEquity;
let balancedEquity;
let growthEquity;

before(
    async () => {
        await sequelize.sync({
            force: true,
        });


        balancedUser =
            await User.create({
                name:
                    'Balanced Integration User',
                email:
                    'balanced-product@example.com',
                password:
                    'test-password',
            });


        conservativeUser =
            await User.create({
                name:
                    'Conservative Integration User',
                email:
                    'conservative-product@example.com',
                password:
                    'test-password',
            });


        balancedToken =
            jwt.sign(
                {
                    id:
                        balancedUser.id,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn:
                        '1h',
                }
            );


        conservativeToken =
            jwt.sign(
                {
                    id:
                        conservativeUser.id,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn:
                        '1h',
                }
            );


        conservativeEquity =
            await FinancialProduct.create({
                name:
                    'Conservative Equity Test Product',
                assetClass:
                    'Equity',
                productType:
                    'ETF',
                institution:
                    'Test Institution',
                interestRate:
                    null,
                description:
                    'Integration test product',
                riskLevel:
                    'Conservative',
                fee:
                    0.2,
            });


        balancedEquity =
            await FinancialProduct.create({
                name:
                    'Balanced Equity Test Product',
                assetClass:
                    'Equity',
                productType:
                    'ETF',
                institution:
                    'Test Institution',
                interestRate:
                    null,
                description:
                    'Integration test product',
                riskLevel:
                    'Balanced',
                fee:
                    0.25,
            });


        growthEquity =
            await FinancialProduct.create({
                name:
                    'Growth Equity Test Product',
                assetClass:
                    'Equity',
                productType:
                    'ETF',
                institution:
                    'Test Institution',
                interestRate:
                    null,
                description:
                    'Integration test product',
                riskLevel:
                    'Growth',
                fee:
                    0.3,
            });
    }
);

beforeEach(
    async () => {
        await RiskManage.destroy({
            where: {},
        });
    }
);

test(
    'GET /api/financialProduct/compatible should return products compatible with current user risk level',
    async () => {
        await RiskManage.create({
            userId:
                balancedUser.id,

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


        const response =
            await request(app)
                .get(
                    '/api/financialProduct/compatible'
                )
                .query({
                    assetClass:
                        'Equity',
                })
                .set(
                    'Authorization',
                    `Bearer ${balancedToken}`
                );


        assert.equal(
            response.status,
            200
        );


        assert.ok(
            Array.isArray(
                response.body.data
            )
        );

        assert.equal(
            response.body.riskLevel,
            'Balanced'
        );

        const names =
            response.body.data.map(
                product =>
                    product.name
            );


        assert.equal(
            names.includes(
                conservativeEquity.name
            ),
            true
        );


        assert.equal(
            names.includes(
                balancedEquity.name
            ),
            true
        );


        assert.equal(
            names.includes(
                growthEquity.name
            ),
            false
        );
    }
);

test(
    'GET /api/financialProduct/compatible should use the latest risk assessment',
    async () => {
        await RiskManage.create({
            userId:
                balancedUser.id,

            riskLevel:
                'Growth',

            timeHorizonProfile:
                'Growth',

            investmentKnowledgeProfile:
                'Growth',

            investmentObjectiveProfile:
                'Growth',

            riskCapacityScore:
                35,

            riskCapacityProfile:
                'Growth',

            riskToleranceScore:
                40,

            riskToleranceProfile:
                'Growth',

            assessmentDate:
                new Date(
                    '2026-01-01T10:00:00Z'
                ),
        });


        await RiskManage.create({
            userId:
                balancedUser.id,

            riskLevel:
                'Conservative',

            timeHorizonProfile:
                'Conservative',

            investmentKnowledgeProfile:
                'Growth',

            investmentObjectiveProfile:
                'Growth',

            riskCapacityScore:
                12,

            riskCapacityProfile:
                'Conservative',

            riskToleranceScore:
                22,

            riskToleranceProfile:
                'Conservative',

            assessmentDate:
                new Date(
                    '2026-02-01T10:00:00Z'
                ),
        });


        const response =
            await request(app)
                .get(
                    '/api/financialProduct/compatible'
                )
                .query({
                    assetClass:
                        'Equity',
                })
                .set(
                    'Authorization',
                    `Bearer ${balancedToken}`
                );


        assert.equal(
            response.status,
            200
        );


        assert.ok(
            Array.isArray(
                response.body.data
            )
        );

        assert.equal(
            response.body.riskLevel,
            'Conservative'
        );

        const names =
            response.body.data.map(
                product =>
                    product.name
            );


        assert.equal(
            names.includes(
                conservativeEquity.name
            ),
            true
        );


        assert.equal(
            names.includes(
                balancedEquity.name
            ),
            false
        );


        assert.equal(
            names.includes(
                growthEquity.name
            ),
            false
        );
    }
);

test(
    'compatible product results should use each authenticated user risk profile independently',
    async () => {
        const now =
            new Date();


        await RiskManage.create({
            userId:
                balancedUser.id,

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
                now,
        });


        await RiskManage.create({
            userId:
                conservativeUser.id,

            riskLevel:
                'Conservative',

            timeHorizonProfile:
                'Conservative',

            investmentKnowledgeProfile:
                'Growth',

            investmentObjectiveProfile:
                'Growth',

            riskCapacityScore:
                12,

            riskCapacityProfile:
                'Conservative',

            riskToleranceScore:
                22,

            riskToleranceProfile:
                'Conservative',

            assessmentDate:
                now,
        });


        const balancedResponse =
            await request(app)
                .get(
                    '/api/financialProduct/compatible'
                )
                .query({
                    assetClass:
                        'Equity',
                })
                .set(
                    'Authorization',
                    `Bearer ${balancedToken}`
                );


        const conservativeResponse =
            await request(app)
                .get(
                    '/api/financialProduct/compatible'
                )
                .query({
                    assetClass:
                        'Equity',
                })
                .set(
                    'Authorization',
                    `Bearer ${conservativeToken}`
                );


        assert.equal(
            balancedResponse.status,
            200
        );

        assert.equal(
            conservativeResponse.status,
            200
        );


       assert.ok(
            Array.isArray(
                balancedResponse.body.data
            )
        );

        assert.ok(
            Array.isArray(
                conservativeResponse.body.data
            )
        );


        assert.equal(
            balancedResponse.body.riskLevel,
            'Balanced'
        );

        assert.equal(
            conservativeResponse.body.riskLevel,
            'Conservative'
        );


        const balancedNames =
            balancedResponse.body.data.map(
                product =>
                    product.name
            );


        const conservativeNames =
            conservativeResponse.body.data.map(
                product =>
                    product.name
            );


        assert.equal(
            balancedNames.includes(
                balancedEquity.name
            ),
            true
        );


        assert.equal(
            conservativeNames.includes(
                balancedEquity.name
            ),
            false
        );


        assert.equal(
            conservativeNames.includes(
                conservativeEquity.name
            ),
            true
        );
    }
);

after(
    async () => {
        await sequelize.close();
    }
);