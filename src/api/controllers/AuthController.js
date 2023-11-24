import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {UserModel, VerificationCodeModel} from "../../models/models.js";
import {jwtSecretKey} from "../../config/index.js";
import {sendCodeToEmail, generateRandomCode} from "../../utils/utils.js";

export const register = async (req, res) => {
    try {
        const data = req.body;

        const confirmCode = generateRandomCode(5);
        await sendCodeToEmail(data.email, confirmCode);

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(data.password, salt);


        const {dataValues: user} = await UserModel.create({
            ...data,
            password: hash
        });

        await VerificationCodeModel.create({
            code: confirmCode,
            userID: user.id
        });

        res.json({
            message: 'Verification code was sent to your email.'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Registration error'
        });
    }
}

export const verifyAccount = async (req, res) => {
    try {
        const confirmCode = req.body.code;
        const login = req.body.login;
        const verification = await VerificationCodeModel.findOne({
            where: {
                code: confirmCode
            }
        });

        if (verification?.dataValues?.code !== confirmCode) {
            console.log('Code invalid')
            throw 'code is invalid';
        }

        const user = await UserModel.findOne({
            where: {
                id: verification.userID
            }
        });

        if (user.dataValues.login !== login) {
            console.log('Login invalid')
            throw 'error: wrong user';
        }

        await user.update({isVerified: true});
        await verification.destroy();

        res.json({
            message: 'success'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            // message: 'Verification error'
            message: 'Suck my robot balls'
        });
    }
}

export const login = async (req, res) => {
    try {
        const data = req.body;

        const user = await UserModel.findOne({
            where: {
                email: data.email
            }
        });

        if (!user.dataValues || user?.dataValues?.isVerified !== true) {
            return res.status(404).json({
                message: 'Error'
            });
        }

        // const isValidPass = await bcrypt.compare(data.password, user.dataValues.password);

        await bcrypt.compare(data.password, user.dataValues.password, (error, result) => {
            if (error) {
                throw error;
            }

            if (result) {
                const token = jwt.sign(
                    {
                        _id: user.id
                    },
                    jwtSecretKey,
                    {
                        expiresIn: '30d'
                    }
                );

                return res.json({
                    message: 'Login success',
                    token: token
                });


            }
            else {
                return res.status(404).json({
                    message: 'Incorrect login or password'
                })
            }
        })
        //
        // if (!isValidPass) {
        //     return res.status(404).json({
        //         message: 'Incorrect login or password'
        //     });
        // }
        //
        // const token = jwt.sign(
        //     {
        //         _id: user.id
        //     },
        //     jwtSecretKey,
        //     {
        //         expiresIn: '30d'
        //     }
        // );


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Login error'
        });
    }
}

export const getVerificationCode = async (req, res) => {
    try {
        const userID = req.userID;

        const user = await UserModel.findOne({
            where: {
                id: userID
            }
        });

        const confirmCode = generateRandomCode(5);
        await sendCodeToEmail(user.dataValues.email, confirmCode);

        await VerificationCodeModel.sync().then(() => {
            VerificationCodeModel.findOrCreate({
                where: {
                    userID: userID
                },
                defaults: {
                    userID: userID,
                    code: confirmCode
                }
            })
        }).then((result) => {
            const verificationCode = result[0];
            const created = result[1];

            if (!created) {
                verificationCode.update({code: confirmCode});
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error receiving verification code'
        })
    }
}

export const resetPassword = async(req, res) => {
    try {
        const {confirmCode, ...data}  = req.body;
        const userID = req.userID;

        const verification = await VerificationCodeModel.findOne({
            where: {
                userID: userID
            }
        });

        if (!verification) {
            return res.status(400).json({
                message: 'Error resetting password (user is not verified)'
            });
        }

        if (verification.dataValues.code !== confirmCode) {
            return res.status(401).json({
                message: 'Error resetting password (wrong confirmation code)'
            });
        }

        const user = UserModel.findOne({
            where: {
                id: verification.dataValues.userID
            }
        });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(data.password, salt);
        await user.update({password: hash});

        await verification.destroy();
        res.json((() => {
            const {password, createdAt, updatedAt, email, ...userData} = user.dataValues;
            return userData;
        })());

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error resetting password'
        });
    }
}