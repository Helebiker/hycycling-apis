const { DataTypes } = require('sequelize')
const { dbConnection } = require('../../db/connection')
const { UsersModel } = require('../Users/Users.model')

const UserMetricsModel = dbConnection.define('UserMetrics', {
  UserId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  Height: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: null
  },
  Weight: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: null
  },
  BMI: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: null
  },
  DOB: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  Gender: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
    validate: {
      isIn: [['M', 'F', 'O']]
    }
  }
})

UserMetricsModel.belongsTo(UsersModel, { foreignKey: 'UserId' })

module.exports = {
  UserMetricsModel
}
