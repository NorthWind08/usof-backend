import {Router} from "express";
import {CategoriesController} from "../controllers/controllers.js";
import checkAuth from "../middlewares/checkAuth.js";
import checkAdmin from "../middlewares/checkAdmin.js";

const router = Router();

router.get('/', CategoriesController.getAll);
router.get('/:id', CategoriesController.getbyID);
router.get('/:id/posts', CategoriesController.getPostsByCategories);

router.post('/', checkAuth, checkAdmin, CategoriesController.createCategory);
router.patch('/:id', checkAuth, checkAdmin, CategoriesController.updateCategory);
router.delete('/:id', checkAuth, checkAdmin, CategoriesController.deleteCategory);

export default router;