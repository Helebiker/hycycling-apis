const {
  updateUserMetrics,
  getUserMetrics
} = require('../../controllers/UserMetrics/UserMetrics.controller')
const {
  UserAuthMiddleware,
  PlaneUserAuthMiddleware
} = require('../../middleware/UserAuth/UserAuth.middleware')

const router = require('express').Router()

router.post('/updateUserMetrics', PlaneUserAuthMiddleware, updateUserMetrics)
router.get('/getUserMetrics', UserAuthMiddleware, getUserMetrics)
module.exports = {
  UserMetricRoutes: router
}
