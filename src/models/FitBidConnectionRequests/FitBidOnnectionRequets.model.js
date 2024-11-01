const { DataTypes } = require("sequelize");
const { dbConnection } = require("../../db/connection");

const FitBidConnectionRequests = dbConnection.define("FitBidConnectionRequests", {
    UserId: {
        type: DataTypes.STRING,
        allowNull: false,
      
       
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


    module.exports = { FitBidConnectionRequests };