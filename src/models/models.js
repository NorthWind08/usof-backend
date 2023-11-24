import {Sequelize} from "sequelize";
import {dbHost, dbName, dbUser, dbPass} from '../config/index.js';

import user from './User.js';
import comment from './Comment.js';
import category from "./Category.js";
import like from './Like.js';
import post from "./Post.js";
import postCategories from "./PostCategories.js";
import verification from "./Verification.js";

export const sequelize = new Sequelize(
    {
        database: dbName,
        username: dbUser,
        host: dbHost,
        password: dbPass,
        dialect: 'mysql'
    }
)

export const UserModel = sequelize.define('user', user);
export const VerificationCodeModel = sequelize.define('verification_codes', verification);

export const PostModel = sequelize.define('post', post);
export const CategoryModel = sequelize.define('category', category);
export const PostCategoriesModel = sequelize.define('post_categories', postCategories);

export const CommentModel = sequelize.define('comment', comment);

export const LikeModel = sequelize.define('like', like);

// UserModel.hasOne(VerificationCodeModel);
// VerificationCodeModel.belongsTo(UserModel);

PostModel.belongsTo(UserModel, { foreignKey: 'author' });
PostModel.belongsToMany(CategoryModel, {
        through: PostCategoriesModel,
        foreignKey: 'postID',
        as: 'postCategories'
});

CategoryModel.belongsToMany(PostModel, {
        through: PostCategoriesModel,
        foreignKey: 'categoryID',
        as: 'categoryPosts',
});


CommentModel.belongsTo(UserModel, { foreignKey: 'author' });
CommentModel.belongsTo(PostModel, { foreignKey: 'parent' });
// CommentModel.belongsTo(CommentModel, {foreignKey: 'response'})

LikeModel.belongsTo(UserModel, { foreignKey: 'userID' });

(async () => {
        await sequelize.sync();
})()