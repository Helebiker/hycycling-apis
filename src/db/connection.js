const { appLogger } = require('../config/appLogger')
const { sequelizeConfig, dbEnvironment } = require('../config/dbConfig')

const dbConnection = sequelizeConfig

dbConnection
  .authenticate()
  .then(() => {
    appLogger.info('Database  Connection has been established successfully.')
    //mention the connection configs
    appLogger.info(`DB_HOST: ${dbEnvironment.DB_HOST}`)
    appLogger.info(`DB_USER: ${dbEnvironment.DB_USER}`)
    appLogger.info(`DB_NAME : ${dbEnvironment.DB_NAME}`)
  })
  .catch(err => {
    appLogger.error('Unable to connect to the database:', err)
    //if unknown database is mentioned create a new database
  })

//a function to clear db tables

module.exports = { dbConnection }
