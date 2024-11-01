const { DataTypes } = require("sequelize");
const { dbConnection } = require("../../db/connection");
const { UsersModel } = require("../Users/Users.model");

const GarminConnectionsModel = dbConnection.define("GarminConnections", {
  UserId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    references: {
      model: UsersModel,
      key: "UserId"
    }
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
  GarminUserId: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  GarminAccessToken: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  GarminRefreshToken: {
    type: DataTypes.STRING,
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


module.exports = { GarminConnectionsModel };
