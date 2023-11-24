import {DataTypes} from "sequelize";

export default {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    description: {
        type: DataTypes.TEXT
    }
}