import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import User from "../models/userModel.js";
import 'dotenv/config';


const createToken =
    id =>
        jwt.sign(
            {
                id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn:
                    '1h',
            }
        );

const loginUser =
    async (req, res) => {
        const {
            email,
            password,
        } = req.body;


        try {
            const user =
                await User.findOne({
                    where: {
                        email,
                    },
                });


            if (!user) {
                return res
                    .status(401)
                    .json({
                        success:
                            false,

                        message:
                            'Invalid email or password',
                    });
            }


            const isMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );


            if (!isMatch) {
                return res
                    .status(401)
                    .json({
                        success:
                            false,

                        message:
                            'Invalid email or password',
                    });
            }


            const token =
                createToken(
                    user.id
                );


            return res
                .status(200)
                .json({
                    success:
                        true,

                    token,
                });
        } catch (error) {
            console.error(
                'Login error:',
                error
            );


            return res
                .status(500)
                .json({
                    success:
                        false,

                    message:
                        'Unable to process login request',
                });
        }
    };


const registerUser =
    async (req, res) => {
        const {
            name,
            email,
            password,
        } = req.body;


        try {
            const exists =
                await User.findOne({
                    where: {
                        email,
                    },
                });


            if (exists) {
                return res
                    .status(409)
                    .json({
                        success:
                            false,

                        message:
                            'User already exists',
                    });
            }


            if (
                !validator.isEmail(
                    email
                )
            ) {
                return res
                    .status(400)
                    .json({
                        success:
                            false,

                        message:
                            'Please enter a valid email',
                    });
            }


            if (
                !password ||
                password.length < 8
            ) {
                return res
                    .status(400)
                    .json({
                        success:
                            false,

                        message:
                            'Please enter a strong password',
                    });
            }


            const salt =
                await bcrypt.genSalt(
                    10
                );


            const hashedPassword =
                await bcrypt.hash(
                    password,
                    salt
                );


            const newUser =
                await User.create({
                    name,
                    email,
                    password:
                        hashedPassword,
                });


            const token =
                createToken(
                    newUser.id
                );


            return res
                .status(201)
                .json({
                    success:
                        true,

                    token,
                });
        } catch (error) {
            console.error(
                'Registration error:',
                error
            );


            return res
                .status(500)
                .json({
                    success:
                        false,

                    message:
                        'Unable to process registration request',
                });
        }
    };

export { loginUser, registerUser };
