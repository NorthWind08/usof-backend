import {getPagination, getPagingData} from "../../utils/helpers/pagination.js";
import {CategoryModel, PostModel, LikeModel, CommentModel, UserModel} from "../../models/models.js";
import exp from "constants";

// TODO: check return values
export const getPost = async(req, res) => {
    try {
        PostModel.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    attributes: [
                        'id', 'title'
                    ],
                    model: CategoryModel,
                    as: 'postCategories',
                    nested: true
                },
                {
                    attributes: [
                        'id', 'login', 'rating', 'role'
                    ],
                    model: UserModel,
                }
            ]
        }).then(post => {
            res.json({
                post
            });
        });

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error getting post'
        });
    }
}

export const getPosts = async(req, res) => {
    try {
        const {page, size} = req.query;
        const {limit, offset} = getPagination(page, size);
        await PostModel.findAll({
            include: [
                {
                    attributes: [
                        'id', 'title'
                    ],
                    model: CategoryModel,
                    as: 'postCategories',
                    nested: true
                },
                limit,
                offset
            ]
        }).then(data => {
            res.json(getPagingData(data, page, limit));
        })

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error getting posts'
        });
    }
}

export const createPost = async(req, res) => {
    try {
        const {title, content, categories} = req.body;
        await PostModel.create({
            title: title,
            content: content,
            author: req.userID,
            status: 'active'
        }).then(post => {
            post.addPostCategories(categories.map(e => {
                return e.id;
            }));

            res.json(post);
        });

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error creating post'
        });
    }
}

export const createComment = async(req, res) => {
    try {
        const data = req.body;
        const postID = req.params.id;
        const userID = req.userID;
        console.log(userID);
        await CommentModel.create({
            content: data.content,
            author: userID,
            // type: data.type,
            parent: postID
        }).then(comment => {
            // if (!data.type) {
            //     return res.status(404).json({
            //         message: 'Bad request'
            //     });
            // }
            // if (data.type === 'response') {
            //     comment.update({
            //         response: data.response
            //     })
            // }
            return res.json({
                comment
            });
        })

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error creating comment'
        });
    }
}

export const getComments = async(req, res) => {
    try {
        await CommentModel.findAll({
            where: {
                parent: req.params.id
            }
        }).then(comments => {
            if (!comments) {
                console.log('No comments');
                return res.json({})
            }
            return res.json({
                comments
            });
        })
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error getting comments'
        })
    }
}

export const updatePost = async(req, res) => {
    try {
        const data = req.body;
        await PostModel.findOne({
            where: {
                id: req.params.id
            },
            include: {
                attributes: [
                    'id', 'title'
                ],
                model: CategoryModel,
                as: 'postCategories',
                nested: true
            }
        }).then(post => {
            if (data.categories) {
                post.removePostCategories(post.dataValues.categories);
                post.addPostCategories(data.categories);
            }

            post.update({
                title: data.title,
                content: data.content,
                status: data.status
            })

            res.json(
                PostModel.findOne({
                    where: {
                        id: req.params.id
                    },
                    include: {
                        attributes: [
                            'id', 'title'
                        ],
                        model: CategoryModel,
                        as: 'postCategories',
                        nested: true
                    }
                })
            )
        })

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error updating post'
        })
    }
}

export const deletePost = async(req, res) => {
    try {
        const user = await UserModel.findOne({
            where: {
                id: req.userID
            }
        });
        const post = await PostModel.findOne({
            where: {
                id: req.params.id
            }
        });

        if (req.userID !== post.dataValues.author && user.dataValues.role !== 'admin') {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        await post.destroy();
        res.json({
            message: 'success'
        });

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error deleting post'
        });
    }
}

export const getCategories = async(req, res) => {
    try {
        await CategoryModel.findAndCountAll({
            include: {
                attributes: [],
                model: PostModel,
                as: 'categoryPosts',
                where: {
                    id: req.params.id
                }
            }
        }).then(data => {
            res.json(data);
        })
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error getting categories'
        });
    }
}
