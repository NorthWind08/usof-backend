import {Router} from "express";
import {AuthController} from '../controllers/controllers.js';
import checkAuth from '../middlewares/checkAuth.js';
import {loginValidator, registrationValidator} from "../validators/validators.js";
import {handleErrors} from "../../utils/utils.js";

const authRouter = Router();

authRouter.post('/register', ...registrationValidator, handleErrors, AuthController.register);

authRouter.post('/login', ...loginValidator, handleErrors, AuthController.login);

authRouter.post('/register/verification', AuthController.verifyAccount);

authRouter.post('/password-reset', checkAuth, AuthController.resetPassword)

export default authRouter;