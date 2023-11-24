import {body} from 'express-validator';

export const registrationValidator = [
    body('email', 'Incorrect email').isEmail(),
    body('password', 'Incorrect password').isLength({min: 5}),
    body('login', 'Incorrect login length').isLength({min: 3}),
    body('fname', 'Incorrect first name ').exists(),
    body('lname', 'Incorrect last name ').exists()
];