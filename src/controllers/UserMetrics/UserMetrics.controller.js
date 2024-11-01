const {
  UserMetricsModel
} = require('../../models/UserMetrics/UserMetrics.model')

exports.updateUserMetrics = async (req, res) => {
  try {
    // Extract the user metrics data from the request body
    const { Height, Weight, BMI, DOB, Gender } = req.body
    const UserId = req.user.UserId
    const requiredFields = ['Height', 'Weight', 'BMI', 'DOB', 'Gender']
    const missingFields = requiredFields.filter(field => !req.body[field])

    // Check for missing fields
    if (missingFields.length) {
      return res.status(400).json({
        message: `Missing fields: ${missingFields.join(', ')}`,
        status: 'error',
        error: true
      })
    }

    // Validate data types
    if (
      typeof Height !== 'number' ||
      typeof Weight !== 'number' ||
      typeof BMI !== 'number' ||
      isNaN(Date.parse(DOB)) || // Check if DOB is a valid date
      typeof Gender !== 'string'
    ) {
      return res.status(400).json({
        message:
          'Invalid data types provided. Ensure Height, Weight, and BMI are numbers, DOB is a valid date, and Gender is a string.',
        status: 'error',
        error: true
      })
    }

    // Find the user metrics in the database
    const userMetrics = await UserMetricsModel.findOne({
      where: { UserId }
    })

    // If user metrics not found, return 404
    if (!userMetrics) {
      return res.status(404).json({
        message: 'User metrics not found',
        status: 'error',
        error: true
      })
    }

    // Update the user metrics
    await userMetrics.update({
      Height,
      Weight,
      BMI,
      DOB,
      Gender
    })

    // Send a success response
    res.status(200).json({
      message: 'User metrics updated successfully',
      status: 'success',
      error: false
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Failed to update user metrics. Please try again later.',
      status: 'error',
      error: true
    })
  }
}

exports.getUserMetrics = async (req, res) => {
  try {
    // Extract the UserId from the request object
    const UserId = req.user.UserId

    // Find the user metrics in the database
    const userMetrics = await UserMetricsModel.findOne({
      where: { UserId }
    })

    // If user metrics not found, return 404
    if (!userMetrics) {
      return res.status(404).json({
        message: 'User metrics not found',
        status: 'error',
        error: true
      })
    }

    // Send the user metrics in the response
    res.status(200).json({
      userMetrics,
      status: 'success',
      error: false
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Failed to fetch user metrics. Please try again later.',
      status: 'error',
      error: true
    })
  }
}
