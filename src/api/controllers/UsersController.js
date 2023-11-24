import {UserModel} from "../../models/models.js";
import bcrypt from "bcrypt";
import User from "../../models/User.js";

export const getAllUsers = async (req, res) => {
    try {
        await UserModel.findAll({
            attributes: [
                'id', 'login', 'fname', 'lname', 'rating', 'pfp_url'
            ],
            where: {
                isVerified: true
            }
        }).then(data => {
            res.json(data);
        });

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error getting users'
        });
    }
}

export const getUser = async(req, res) => {
    try {
        await UserModel.findOne({
            attributes: [
                'id', 'login', 'fname', 'lname', 'rating', 'pfp_url'
            ],
            where: {
                id: req.params.id
            }
        }).then(user => {
            if (!user) {
                return res.status(400).json({
                    message: 'User not found'
                });
            }

            res.json(user);
        })

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error getting user'
        });
    }
}

export const createUser = async (req, res) => {
    try {
        const data = req.body;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(data.password, salt);

        await UserModel.create({
            ...data,
            password: hash
        }).catch(error => {
            throw 'Bad request';
        });
        res.json({
            message: 'Success'
        });

    } catch(error) {
        console.log(error)
        return res.status(500).json({
            message: 'Error creating user'
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const data = req.body;
        const user = UserModel.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        }

        if (data?.password) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(data.password, salt);
            data.password = hash;
        }
        await user.update(data);

        const {password, createdAt, updatedAt, email, ...userData} = user.dataValues;
        res.json(userData);

    } catch(error) {
        console.log(error);
        return res.status(401).json({
            message: 'Error updating user'
        });
    }
}

export const deleteUser = async (req, res) => {
    try {
        await UserModel.destroy({
            where: {
                id: req.params.id
            }
        });
        res.json({
            message: 'Success'
        });

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error deleting user'
        });
    }
}

// TODO: Fix wrong file names
export const uploadPFP = async (req, res) => {
    try {
        const user = await UserModel.findOne({
            where: {
                id: req.userID
            }
        });

        if (!user) {
            return res.status(400).json({
                message: 'Error uploading pfp'
            })
        }

        await user.update({
            pfp_url: `/uploads/${req.file.name}`
        });

        const {
            password, createdAt, updatedAt, email, ...userData
        } = user.dataValues;

        res.json(userData);

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error uploading pfp'
        });
    }
}

export const editMe = async (req, res) => {
    try {
        const data = req.body;

        const user = UserModel.findOne({
            where: {
                id: req.userID
            }
        });

        if (!user) {
            return res.status(400).json({
                message: 'Error, user not found'
            });
        }

        if (data?.password) {
            const salt = await bcrypt.genSalt(10);
            data.password = await bcrypt.hash(data.password, salt);
        }

        await user.update(data);

        const {
            password, createdAt, updatedAt, email, ...userData
        } = user.dataValues;

        res.json(userData)

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'error editing user'
        })
    }
}