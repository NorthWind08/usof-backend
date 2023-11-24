import {Router} from "express";
import {CommentsController, LikesController} from "../controllers/controllers.js";
import checkAdmin from "../middlewares/checkAdmin.js";
import checkAuth from "../middlewares/checkAuth.js";

const router = Router();

router.get('/:id', CommentsController.getByID);
router.patch('/:id', checkAuth, CommentsController.updateComment);
router.delete('/:id', checkAuth, checkAdmin, CommentsController.deleteComment);

export default router;