import {CategoryModel, PostModel} from "../../models/models.js";
import {getPagination, getPagingData} from "../../utils/helpers/pagination.js";

export const getAll = async(req, res) => {
    try {
        await CategoryModel.findAndCountAll().then(data => {
            res.json(data)
        })
    } catch(error) {
        console.log(error);
        return res.status(500).json({
           message: 'Error getting categories'
        });
    }
}

export const getbyID = async(req, res) => {
    try {
        await CategoryModel.findOne({
            where: {
                id: req.params.id
            }
        }).then(data => {
            res.json(data);
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error getting categories'
        });
    }
}

export const getPostsByCategories = async(req, res) => {
    try {
        const {page, size} = req.query;
        const {limit, offset} = getPagination(page, size);
        await PostModel.findAndCountAll({
            include: {
                attributes: [],
                model: CategoryModel,
                as: 'postCategories',
                nested: true,
                where: {
                    id: req.params.id
                }
            },
            limit,
            offset
        }).then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response);
        });

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error getting posts'
        });
    }
}

export const createCategory = async(req, res) => {
    try {
        await CategoryModel.create({
            title: req.body.title,
            description: req.body.description
        }).then(category => {
            res.json(category);
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error creating category'
        });
    }
}

export const updateCategory = async(req, res) => {
    try {
        await CategoryModel.findOne({
            where: {
                id: req.params.id
            }
        }).then(async (category) => {
            await category.update({
                description: req.body.description
            })
            res.json(category);
        })
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error updating category'
        });
    }
}

export const deleteCategory = async(req, res) => {
    try {
        await CategoryModel.findOne({
            where: {
                id: req.params.id
            }
        }).then(async(category) => {
            await category.destroy();
            res.json({
                message: 'Success'
            });
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error deleting category'
        });
    }
}