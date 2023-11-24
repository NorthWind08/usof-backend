import {DataTypes} from "sequelize";

export default {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },

    code: {
        type: DataTypes.STRING(5),
        allowNull: false,
        unique: true
    },

    userID: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        unique: true
    }
}