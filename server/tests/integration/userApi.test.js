import test, {
    before,
    beforeEach,
    after,
} from 'node:test';

import assert
    from 'node:assert/strict';

import request
    from 'supertest';

import bcrypt
    from 'bcrypt';

import jwt
    from 'jsonwebtoken';

import app
    from '../../app.js';

import sequelize
    from '../../config/db.js';

import User
    from '../../models/userModel.js';


const registerEmail =
    'register-integration@example.com';

const registerPassword =
    'RegisterPassword123';

const testEmail =
    'login-integration@example.com';

const testPassword =
    'StrongPassword123';


before(
    async () => {
        await sequelize.sync({
            force: true,
        });
    }
);


beforeEach(
    async () => {
        await User.destroy({
            where: {},
        });


        const hashedPassword =
            await bcrypt.hash(
                testPassword,
                10
            );


        await User.create({
            name:
                'Login Integration User',

            email:
                testEmail,

            password:
                hashedPassword,
        });
    }
);


after(
    async () => {
        await sequelize.close();
    }
);


test(
    'POST /api/user/register should create a user with a hashed password',
    async () => {
        await User.destroy({
            where: {
                email:
                    registerEmail,
            },
        });


        const response =
            await request(app)
                .post(
                    '/api/user/register'
                )
                .send({
                    name:
                        'Register Integration User',

                    email:
                        registerEmail,

                    password:
                        registerPassword,
                });


        assert.equal(
            response.status,
            201
        );


        assert.equal(
            response.body.success,
            true
        );


        assert.equal(
            typeof response.body.token,
            'string'
        );


        const savedUser =
            await User.findOne({
                where: {
                    email:
                        registerEmail,
                },
            });


        assert.ok(
            savedUser
        );


        assert.notEqual(
            savedUser.password,
            registerPassword
        );


        const passwordMatches =
            await bcrypt.compare(
                registerPassword,
                savedUser.password
            );


        assert.equal(
            passwordMatches,
            true
        );


        const decoded =
            jwt.verify(
                response.body.token,
                process.env.JWT_SECRET
            );


        assert.equal(
            decoded.id,
            savedUser.id
        );
    }
);


test(
    'POST /api/user/register should reject duplicate email',
    async () => {
        const duplicateEmail =
            'duplicate@example.com';


        const hashedPassword =
            await bcrypt.hash(
                'ExistingPassword123',
                10
            );


        await User.create({
            name:
                'Existing User',

            email:
                duplicateEmail,

            password:
                hashedPassword,
        });


        const countBefore =
            await User.count({
                where: {
                    email:
                        duplicateEmail,
                },
            });


        const response =
            await request(app)
                .post(
                    '/api/user/register'
                )
                .send({
                    name:
                        'Another User',

                    email:
                        duplicateEmail,

                    password:
                        'AnotherPassword123',
                });


        assert.equal(
            response.status,
            409
        );


        assert.equal(
            response.body.success,
            false
        );


        assert.equal(
            response.body.message,
            'User already exists'
        );


        const countAfter =
            await User.count({
                where: {
                    email:
                        duplicateEmail,
                },
            });


        assert.equal(
            countAfter,
            countBefore
        );
    }
);


test(
    'POST /api/user/register should reject invalid email without creating user',
    async () => {
        const invalidEmail =
            'not-an-email';


        const countBefore =
            await User.count();


        const response =
            await request(app)
                .post(
                    '/api/user/register'
                )
                .send({
                    name:
                        'Invalid Email User',

                    email:
                        invalidEmail,

                    password:
                        'ValidPassword123',
                });


        assert.equal(
            response.status,
            400
        );


        assert.equal(
            response.body.success,
            false
        );


        const countAfter =
            await User.count();


        assert.equal(
            countAfter,
            countBefore
        );
    }
);


test(
    'POST /api/user/register should reject weak password without creating user',
    async () => {
        const countBefore =
            await User.count();


        const response =
            await request(app)
                .post(
                    '/api/user/register'
                )
                .send({
                    name:
                        'Weak Password User',

                    email:
                        'weak-password@example.com',

                    password:
                        'short',
                });


        assert.equal(
            response.status,
            400
        );


        assert.equal(
            response.body.success,
            false
        );


        assert.equal(
            response.body.message,
            'Please enter a strong password'
        );


        const countAfter =
            await User.count();


        assert.equal(
            countAfter,
            countBefore
        );
    }
);


test(
    'POST /api/user/login should return a valid JWT for correct credentials',
    async () => {
        const response =
            await request(app)
                .post(
                    '/api/user/login'
                )
                .send({
                    email:
                        testEmail,

                    password:
                        testPassword,
                });


        assert.equal(
            response.status,
            200
        );


        assert.equal(
            response.body.success,
            true
        );


        assert.equal(
            typeof response.body.token,
            'string'
        );


        const decoded =
            jwt.verify(
                response.body.token,
                process.env.JWT_SECRET
            );


        const user =
            await User.findOne({
                where: {
                    email:
                        testEmail,
                },
            });


        assert.equal(
            decoded.id,
            user.id
        );
    }
);


test(
    'POST /api/user/login should reject incorrect password',
    async () => {
        const response =
            await request(app)
                .post(
                    '/api/user/login'
                )
                .send({
                    email:
                        testEmail,

                    password:
                        'WrongPassword123',
                });


        assert.equal(
            response.status,
            401
        );


        assert.equal(
            response.body.success,
            false
        );


        assert.equal(
            response.body.message,
            'Invalid email or password'
        );
    }
);


test(
    'POST /api/user/login should reject unknown user',
    async () => {
        const response =
            await request(app)
                .post(
                    '/api/user/login'
                )
                .send({
                    email:
                        'unknown@example.com',

                    password:
                        testPassword,
                });


        assert.equal(
            response.status,
            401
        );


        assert.equal(
            response.body.success,
            false
        );


        assert.equal(
            response.body.message,
            'Invalid email or password'
        );
    }
);