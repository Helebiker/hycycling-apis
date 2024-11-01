const express = require('express')
const { systemConfig } = require('./src/config/systemConfig')
const { appLogger } = require('./src/config/appLogger')
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const http = require('http')
const { dbConnection } = require('./src/db/connection')
const expressListEndpoints = require('express-list-endpoints')
const { UserAuthRoutes } = require('./src/routes/UserAuth/UserAuth.routes')
const { emptyTablesRoute } = require('./src/dev/clearDB')
const { DeviceRoutes } = require('./src/routes/Devices/Devices.routes')
const { UserMetricRoutes } = require('./src/routes/UserMetrics/UserMetrics.routes')
const app = express()
const port = process.env.PORT || 3000

app.use(
  cors({
    origin: '*'
  })
)
app.use(express.json())
app.post('/clearDb', emptyTablesRoute)
app.get('/', (req, res) => {
  res.send(systemConfig.appName)
})
app.use('/UserAuth', UserAuthRoutes)
app.use('/Devices',DeviceRoutes)
app.use('/UserMetrics',UserMetricRoutes)
const loadModels = () => {
  const modelsPath = path.join(__dirname, './src/models')
  fs.readdirSync(modelsPath).forEach(folder => {
    const folderPath = path.join(modelsPath, folder)
    if (fs.lstatSync(folderPath).isDirectory()) {
      fs.readdirSync(folderPath).forEach(file => {
        if (file.endsWith('.model.js')) {
          require(path.join(folderPath, file))
        }
      })
    }
  })
}

// Function to synchronize all models
const syncEachModel = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      appLogger.info('=====================')
      appLogger.info('Starting to synchronize models...')
      appLogger.info('=====================')

      loadModels() // Load models dynamically

      for (const model of Object.values(dbConnection.models)) {
        appLogger.info(`Synchronizing ${model.name}...`)
        await model.sync({
          alter: process.env.NODE_ENV === 'production' ? true : true,
          force: false
        })
        appLogger.info(`${model.name} was synchronized successfully.`)
      }

      appLogger.info('=====================')
      appLogger.info('Models synchronized successfully.')
      appLogger.info('=====================')
      resolve()
    } catch (error) {
      appLogger.error(error)
      reject(error)
    }
  })
}

app.get('/api/call',(req,res)=>{
 const htmlFile = fs.readFileSync('./src/views/fitbidConnection.html','utf-8')
  return res.send(htmlFile)
})

const startServer = async () => {
  syncEachModel()
    .then(() => {
      //list all envs for monitoring

      app.listen(process.env.PORT || 3000, () => {
        appLogger.info(`Server started on port ${process.env.PORT || 3000}`)
        appLogger.info(`Environment: ${process.env.NODE_ENV}`)

        // Log all endpoints for monitoring
        expressListEndpoints(app).forEach(route => {
          appLogger.info(`Route Enabled: ${route.methods} ${route.path}`)
        })
      })
    })
    .catch(error => {
      appLogger.error('Error starting server. Exiting.')
    })
}

startServer()

module.exports = { app }
