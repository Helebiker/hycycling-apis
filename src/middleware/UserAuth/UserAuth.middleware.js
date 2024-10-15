const { UsersModel } = require('../../models/Users/Users.model')
const { AuthTokensModel } = require('../../models/AuthTokens/AuthTokens.model') // assuming this model exists
const { appLogger } = require('../../config/appLogger')

exports.UserAuthMiddleware = async (req, res, next) => {
  try {
    const { auhtoken } = req.headers

    if (!auhtoken) {
      return res.status(400).json({
        message: 'Token not provided'
      })
    }

    // Verify the auth token
    const authTokenRecord = await AuthTokensModel.findOne({
      where: { Token: auhtoken }
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
