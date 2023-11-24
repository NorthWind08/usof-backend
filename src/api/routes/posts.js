import {Router} from "express";
import {PostsController, LikesController} from "../controllers/controllers.js"
import {handleErrors} from "../../utils/utils.js";
import checkAuth from "../middlewares/checkAuth.js";
import {postsValidator} from "../validators/validators.js";


const router = Router();

router.post('/', ...postsValidator, handleErrors, checkAuth, PostsController.createPost);
router.get('/', PostsController.getPosts);
router.get('/:id', PostsController.getPost);

router.get('/:id/comments', PostsController.getComments);
router.post('/:id/comments', checkAuth, PostsController.createComment);

router.get('/:id/categories', PostsController.getCategories);
router.patch('/:id', checkAuth, PostsController.updatePost);
router.delete('/:id', checkAuth, PostsController.deletePost);

router.post('/:id/like', checkAuth, LikesController.createLike);
router.delete('/:id/like', checkAuth, LikesController.deleteLike);

export default router;