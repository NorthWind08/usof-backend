import {DataTypes} from "sequelize";

export default {
    postID: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },

    categoryID: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    }
}