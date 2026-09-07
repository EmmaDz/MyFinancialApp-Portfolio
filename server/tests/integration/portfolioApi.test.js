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

import Portfolio
    from '../../models/portfolioModel.js';


let user;
let token;

let otherUser;
let otherToken;


before(
    async () => {
        await sequelize.sync({
            force: true,
        });


        user =
            await User.create({
                name:
                    'Portfolio Integration User',

                email:
                    'portfolio-integration@example.com',

                password:
                    'test-password',
            });


        otherUser =
            await User.create({
                name:
                    'Other Portfolio User',

                email:
                    'other-portfolio@example.com',

                password:
                    'test-password',
            });


        token =
            jwt.sign(
                {
                    id:
                        user.id,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn:
                        '1h',
                }
            );


        otherToken =
            jwt.sign(
                {
                    id:
                        otherUser.id,
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
        await Portfolio.destroy({
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
    'POST /api/portfolio should create the correct portfolio for the authenticated user',
    async () => {
        const response =
            await request(app)
                .post(
                    '/api/portfolio'
                )
                .set(
                    'Authorization',
                    `Bearer ${token}`
                )
                .send({
                    riskLevel:
                        'Balanced',
                });


        assert.equal(
            response.status,
            201
        );


        assert.equal(
            response.body.message,
            'Portfolio created successfully'
        );


        assert.equal(
            response.body.portfolio.userId,
            user.id
        );


        assert.equal(
            response.body.portfolio.riskLevel,
            'Balanced'
        );


        assert.equal(
            response.body.portfolio.equity,
            50
        );


        assert.equal(
            response.body.portfolio.fixedIncome,
            45
        );


        assert.equal(
            response.body.portfolio.cashEquivalent,
            5
        );


        const savedPortfolio =
            await Portfolio.findOne({
                where: {
                    userId:
                        user.id,
                },
            });


        assert.ok(
            savedPortfolio
        );


        assert.equal(
            savedPortfolio.riskLevel,
            'Balanced'
        );


        assert.equal(
            savedPortfolio.equity,
            50
        );


        assert.equal(
            savedPortfolio.fixedIncome,
            45
        );


        assert.equal(
            savedPortfolio.cashEquivalent,
            5
        );
    }
);

test(
    'GET /api/portfolio/fetchPortfolio should return only the authenticated user portfolio',
    async () => {
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


        await Portfolio.create({
            userId:
                otherUser.id,

            riskLevel:
                'Growth',

            equity:
                70,

            fixedIncome:
                25,

            cashEquivalent:
                5,
        });


        const response =
            await request(app)
                .get(
                    '/api/portfolio/fetchPortfolio'
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
            response.body.portfolio.userId,
            user.id
        );


        assert.equal(
            response.body.portfolio.riskLevel,
            'Balanced'
        );


        assert.notEqual(
            response.body.portfolio.userId,
            otherUser.id
        );
    }
);