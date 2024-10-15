const { Sequelize } = require("sequelize");

require("dotenv").config();

const testEnvironment = {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME
};


const productionEnvironment =  {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME
};



const environment = process.env.NODE_ENV === 'test' ? testEnvironment : productionEnvironment;

const sequelizeConfig = new Sequelize(
  environment.DB_NAME,
  environment.DB_USER,
  environment.DB_PASSWORD,
  {
    host: environment.DB_HOST,
    dialect: "postgres",
    logging: false,
    port: environment.DB_PORT,
    timezone: "+00:00",
    
   
  }
);

module.exports = { sequelizeConfig, dbEnvironment: environment,testEnvironment,productionEnvironment };