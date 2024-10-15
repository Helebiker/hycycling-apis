
const { dbConnection } = require("../../db/connection");
const { DataTypes } = require("sequelize");
const { UsersModel } = require("../Users/Users.model");
const AuthTokenModel = dbConnection.define("AuthToken", {
    UserId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: UsersModel,
            key: 'UserId'
        }
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
        //default 10 days from now
        defaultValue: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});
AuthTokenModel.belongsTo(UsersModel, { foreignKey: 'UserId' });

module.exports = { AuthTokenModel };