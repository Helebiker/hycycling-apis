const { dbConnection } = require("../../db/connection");
const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

const uniqid = require("uniqid");
const UsersModel = dbConnection.define("Users", {
    UserId: {
        type: DataTypes.STRING,
        allowNull: true,
        primaryKey: true,
        defaultValue: uniqid('iaCycling'),
    },
    UserName : {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    FirstName: {
        type: DataTypes.STRING,
        allowNull: false,
       
    },
    LastName: {
        type: DataTypes.STRING,
        allowNull: false,
       
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
   FirstName : {
        type: DataTypes.STRING,
        allowNull: false,
    },
    LastName : {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ProfilePicture:{
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue:'https://fuelgo.info/wp-content/uploads/2024/04/logo-white-e1712495209481.png'
      
    }
});



UsersModel.beforeCreate(async (user) => {
    const hashedPassword = await bcrypt.hash(user.Password, 10); // Corrected to user.Password
    user.Password = hashedPassword;
  
});




UsersModel.prototype.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.Password); // Corrected to this.Password
};

module.exports = { UsersModel };