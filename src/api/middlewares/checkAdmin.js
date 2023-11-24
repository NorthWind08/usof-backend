import {UserModel} from "../../models/models.js";

export default async (req, res, next) => {
    try {
        const user = await UserModel.findOne({
            where: {
                id: req.userID
            }
        });

        if (user?.role !== 'admin') {
            console.log("NOT ADMIN WTF");
            throw 'Permission denied';
        }

        next();
    } catch(error) {
        return res.status(403).json({
            message: 'Permission denied'
        });
    }
}