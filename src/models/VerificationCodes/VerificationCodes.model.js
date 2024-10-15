const { dbConnection } = require("../../db/connection");

const { DataTypes } = require("sequelize");
const VerificationCodesModel = dbConnection.define("VerificationCodes", {
    OTP: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    VerificationCode: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    Verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    Attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
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

module.exports = { VerificationCodesModel };