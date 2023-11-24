import jwt from "jsonwebtoken";
import {jwtSecretKey} from "../../config/index.js";

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace('/Bearer\s?/', '')

    if (!token) {
        return res.status(403).json({
            message: 'Permission denied'
        })
    }

    try {
        const decoded = jwt.verify(token, jwtSecretKey);

        req.userID = decoded._id;
        next();

    } catch(error) {
        console.log(error);
        return res.status(403).json({
            message: 'Permission denied'
        })
    }
}