const {
  getConnectedDevices,
  confirmFitBidConnection,
  connectFitBidDevice
} = require('../../controllers/Devices/Devices.controller')
const {
  UserAuthMiddleware
} = require('../../middleware/UserAuth/UserAuth.middleware')

const router = require('express').Router()

router.get('/getConnectedDevices', UserAuthMiddleware, getConnectedDevices)
router.post('/connectFitBidDevice', UserAuthMiddleware, connectFitBidDevice)
router.get('/confirmFitBidConnection', confirmFitBidConnection)

module.exports = {
  DeviceRoutes: router
}
