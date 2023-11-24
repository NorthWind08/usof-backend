import {DataTypes} from "sequelize";

export default {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    // parent: {
    //     type: DataTypes.BIGINT.UNSIGNED,
    //     allowNull: false
    // },

    author: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },

    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    // type: {
    //     type: DataTypes.ENUM('post', 'response'),
    //     allowNull: false,
    //     default: 'post'
    // }
}