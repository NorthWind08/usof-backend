import {DataTypes} from "sequelize";

export default {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    userID: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },

    entityID: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },

    entityType: {
        type: DataTypes.ENUM('post', 'comment'),
        allowNull: false,
        defaultValue: 'post'
    },

    type: {
        type: DataTypes.ENUM('like', 'dislike'),
        allowNull: false,
        defaultValue: 'like'
    }
}