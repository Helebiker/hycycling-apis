const { DataTypes } = require("sequelize");
const { dbConnection } = require("../../db/connection");
const { UsersModel } = require("../Users/Users.model");

const FitBidConnections = dbConnection.define("FitBidConnections", {
  UserId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    references: {
      model: UsersModel,
      key: "UserId"
    }
  },
  Code : {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  FitBidRefreshToken: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  FitBidUserId : {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  FitBidAccessToken: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  Connected: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  ConnectedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
});

module.exports = { FitBidConnections };
