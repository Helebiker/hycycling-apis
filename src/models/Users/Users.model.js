const { dbConnection } = require('../../db/connection')
const { DataTypes } = require('sequelize')
const bcrypt = require('bcrypt')
const uniqid = require('uniqid')
const { systemConfig } = require('../../config/systemConfig')
const {
  FitBidConnections
} = require('../FitBidConnections/FitBidConnections.model')
const {
  GarminConnectionsModel
} = require('../GarminConnections/GarminConnections.model')
const { UserMetricsModel } = require('../UserMetrics/UserMetrics.model')

const UsersModel = dbConnection.define('Users', {
  UserId: {
    type: DataTypes.STRING,
    allowNull: true,
    primaryKey: true,
    defaultValue: uniqid(systemConfig.appName + '-')
  },
  UserName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  FirstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  LastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  ProfilePicture: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue:
      'https://fuelgo.info/wp-content/uploads/2024/04/logo-white-e1712495209481.png'
  }
})

UsersModel.beforeCreate(async user => {
  const hashedPassword = await bcrypt.hash(user.Password, 10)
  user.Password = hashedPassword
})

UsersModel.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.Password)
}

UsersModel.afterCreate(async user => {
  await UserMetricsModel.create({
    UserId: user.UserId
  })
  await FitBidConnections.create({
    UserId: user.UserId
  })
  await GarminConnectionsModel.create({
    UserId: user.UserId
  })
})
UsersModel.hasOne(FitBidConnections, {
  foreignKey: 'UserId',
  onDelete: 'CASCADE'
})
UsersModel.hasOne(GarminConnectionsModel, {
  foreignKey: 'UserId',
  onDelete: 'CASCADE'
})

module.exports = { UsersModel }
