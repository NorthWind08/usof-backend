import {body} from 'express-validator';

export const loginValidator = [
    body('email', 'Incorrect email').isEmail(),
    body('password', 'Incorrect password').isLength({min: 5})
];