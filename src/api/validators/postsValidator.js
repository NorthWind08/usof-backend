import {body} from "express-validator";

export const postsValidator = [
    body('title', 'Incorrect title length').isLength({min: 5, max: 255}),
    body('content', 'Incorrect content length').isLength({min: 5, max: 5000})
];