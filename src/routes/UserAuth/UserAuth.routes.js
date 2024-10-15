const {
  registerSendOTP,
  registerVerifyOTP,
  login
} = require('../../controllers/UerAuth/UserAuth.controller')

const router = require('express').Router()

router.post('/registerSendOTP', registerSendOTP)
router.post('/registerVerifyOTP', registerVerifyOTP)
router.post('/login', login)

module.exports = {
  UserAuthRoutes: router
}
