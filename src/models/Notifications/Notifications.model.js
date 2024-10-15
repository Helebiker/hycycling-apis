const { DataTypes } = require('sequelize');
const { dbConnection } = require('../../db/connection');


const NotificationsModel = dbConnection.define('Notifications', {
  NotificationId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  SenderId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  UserId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  NotificationTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  NotificationBody: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Viewed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
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


module.exports = {
  NotificationsModel,
};