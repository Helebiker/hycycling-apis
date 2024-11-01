const { UsersModel } = require('../../models/Users/Users.model')

const { appLogger } = require('../../config/appLogger')
const { AuthTokenModel } = require('../../models/AuthToken/AuthToken.model')
const {
  UserMetricsModel
} = require('../../models/UserMetrics/UserMetrics.model')

exports.UserAuthMiddleware = async (req, res, next) => {
  try {
    const { authtoken } = req.headers

    if (!authtoken) {
      return res.status(400).json({
        message: 'Token not provided'
      })
    }

    // Verify the auth token
    const authTokenRecord = await AuthTokenModel.findOne({
      where: { token: authtoken }
    })

    if (!authTokenRecord) {
      return res.status(401).json({
        message: 'Invalid token'
      })
    }

    // Fetch user associated with the token
    const user = await UsersModel.findOne({
      where: { UserId: authTokenRecord.UserId }
    })

    const userMetrics = await UserMetricsModel.findOne({
      where: { UserId: authTokenRecord.UserId }
    })
    if (!userMetrics) {
      return res.status(404).json({
        message: 'User metrics not found'
      })
    }

    const notNullFIelds = ['Height', 'Weight', 'BMI', 'DOB', 'Gender']
    const missingFields = notNullFIelds.filter(field => !userMetrics[field])
    if (missingFields.length) {
      return res.status(401).json({
        message: `user metrics missing fields: ${missingFields.join(', ')}`,
        route: 'UserMetrics'
      })
    }

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    // Attach user to request object for further use in the request lifecycle
    req.user = user

    // Move to the next middleware or route handler
    next()
  } catch (error) {
    // Log the error for debugging
    appLogger.error('Authentication middleware error:', error)

    return res.status(500).json({
      message: 'Internal server error'
    })
  }
}

exports.PlaneUserAuthMiddleware = async (req, res, next) => {
  try {
    const { authtoken } = req.headers

    if (!authtoken) {
      return res.status(400).json({
        message: 'Token not provided'
      })
    }

    // Verify the auth token
    const authTokenRecord = await AuthTokenModel.findOne({
      where: { token: authtoken }
    })

    if (!authTokenRecord) {
      return res.status(401).json({
        message: 'Invalid token'
      })
    }

    // Fetch user associated with the token
    const user = await UsersModel.findOne({
      where: { UserId: authTokenRecord.UserId }
    })

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    // Attach user to request object for further use in the request lifecycle
    req.user = user

    // Move to the next middleware or route handler
    next()
  } catch (error) {
    // Log the error for debugging
    appLogger.error('Authentication middleware error:', error)

    return res.status(500).json({
      message: 'Internal server error'
    })
  }
}
