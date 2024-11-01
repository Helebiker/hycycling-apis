const { DataTypes } = require('sequelize')
const { dbConnection } = require('../../db/connection')
const uniqid = require('uniqid')
const GoalTypesAllowed = [
  'Endurance',
  'Weight Loss',
  'Strength',
  'Flexibility',
  'Balance',
  'Speed',
  'Power',
  'Muscle Growth',
  'General Health'
]
const GoalModel = dbConnection.define('Goals', {
  GoalId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    defaultValue: uniqid('Goal-')
  },
  UserId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  GoalType: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [GoalTypesAllowed]
    }
  },
  GoalDescription: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  GoalDeadline: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  PrimaryGoal: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
})

module.exports = {
  GoalModel
}
