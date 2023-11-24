import {Router} from "express";
import {UserController} from "../controllers/controllers.js";
import {upload} from "../../storage.js";
import checkAuth from "../middlewares/checkAuth.js"
import checkAdmin from "../middlewares/checkAdmin.js";
import {registrationValidator} from "../validators/registrationValidator.js";
import {handleErrors} from "../../utils/utils.js";

const router = Router();

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUser);

router.post('/', ...registrationValidator, handleErrors, checkAuth, checkAdmin, UserController.createUser);

router.patch('/avatar', checkAuth, upload.single('file'), UserController.uploadPFP);
router.patch('/me', checkAuth, UserController.editMe);
router.patch('/:id', checkAuth, checkAdmin, UserController.updateUser);

router.delete('/:id', checkAuth, checkAdmin, UserController.deleteUser);

export default router;