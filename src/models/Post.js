import {DataTypes} from "sequelize";

export default {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },

    author: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false
    },

    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        default: 'active'
    }
}