import {CommentModel, UserModel} from "../../models/models.js";

export const getByID = async(req, res) => {
    try {
        await CommentModel.findOne({
            where: {
                id: req.params.id
            }
        }).then(comment => {
            res.json(comment);
        });

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error getting comment'
        });
    }
}

export const updateComment = async(req, res) => {
    try {
        await CommentModel.findOne({
            where: {
                id: req.params.id
            }
        }).then(async (comment) => {
            if (req.userID !== comment.dataValues.author) {
                return res.status(403).json({
                    message: 'Access denied'
                });
            }

            await comment.update({
                content: req.body.content
            });
            res.json(comment);
        })

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error updating comment'
        });
    }
}

export const deleteComment = async(req, res) => {
    try {
        await CommentModel.findOne({
            where: {
                id: req.params.id
            }
        }).then(async (comment) => {
            const user = await UserModel.findOne({
                where: {
                    id: req.userID
                }
            });

            if (user.dataValues.id !== comment.dataValues.author && user.dataValues.role !== 'admin') {
                return res.status(403).json({
                    message: 'Access denied'
                });
            }

            await comment.destroy();
            res.json({
                message: 'Success'
            });
        });

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error deleting comment'
        });
    }
}