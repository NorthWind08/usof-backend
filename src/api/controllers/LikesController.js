import {LikeModel} from "../../models/models.js";

export const createLike = async(req, res) => {
    try {
        await LikeModel.findOrCreate({
            where: {
                userID: req.userID,
                entityID: req.params.id,
                entityType: req.body.entityType
            },
            defaults: {
                userID: req.userID,
                entityID: req.params.id,
                entityType: req.body.entityType,
                type: req.body.type
            }
        }).then(data => {
            res.json({
                message: 'success'
            });
        });

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error creating like'
        });
    }
}

export const deleteLike = async(req, res) => {
    try {
        await LikeModel.findOne({
            where: {
                userID: req.userID,
                entityID: req.params.id,
                entityType: req.body.entityType
            }
        }).destroy();

        res.json({
            message: 'success'
        });

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error deleting like'
        });
    }
}