const uuid = require('uuid')
const {
  VerificationCodesModel
} = require('../../models/VerificationCodes/VerificationCodes.model')
const { sendMailUsingMailer } = require('../../utils/mail/mailer')
const {
  sendOTPTemplate
} = require('../../utils/mail/templates/auth/auth.templates')
const { UsersModel } = require('../../models/Users/Users.model')
const { createNewAuthToken } = require('../../utils/auth/authToken.generator')

const bcrypt = require('bcrypt')
const {
  UserMetricsModel
} = require('../../models/UserMetrics/UserMetrics.model')

exports.registerSendOTP = async (req, res) => {
  try {
    // Extract required fields from request body
    const { FirstName, LastName, Email, UserName, Password } = req.body

    // Define the required fields for validation
    const requiredFields = [
      'FirstName',
      'LastName',
      'Email',
      'UserName',
      'Password'
    ]

    // Check for missing fields in the request body
    const missingFields = requiredFields.filter(field => !req.body[field])
    if (missingFields.length) {
      return res.status(400).send({
        message: `Missing fields: ${missingFields.join(', ')}`
      })
    }

    const checkEmailExists = await UsersModel.findOne({
      where: {
        Email
      }
    })

    if (checkEmailExists) {
      return res.status(400).send({
        message: 'Email already exists'
      })
    }
    const checkUserNameExists = await UsersModel.findOne({
      where: {
        UserName
      }
    })
    if (checkUserNameExists) {
      return res.status(400).send({
        message: 'UserName already exists'
      })
    }

    // Generate a unique verification code and a random OTP
    const VerificationCode = uuid.v4().slice(0, 6) // Shortened UUID
    const randomOTP = Math.floor(100000 + Math.random() * 900000) // 6-digit OTP

    // Store the verification code and OTP in the database
    await VerificationCodesModel.create({
      VerificationCode,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // Set expiration to 5 minutes from now
      Verified: false, // Default to not verified
      Attempts: 0, // Set initial number of attempts to 0
      createdAt: new Date(),
      updatedAt: new Date(),
      OTP: randomOTP
    })

    // Send the OTP via email using the mailer utility
    await sendMailUsingMailer({
      to: Email,
      subject: 'One Time Password (OTP) For Verification',
      html: `${sendOTPTemplate(randomOTP)}` // Insert OTP into the email template
    })

    // Send a response indicating the OTP was generated successfully
    res.send({
      message: 'Verification code sent successfully',
      VerificationCode
    })
  } catch (error) {
    // Handle any errors that occur and send a generic error response
    console.error('Error while sending OTP:', error)
    return res.status(500).send({
      message: 'Failed to send OTP. Please try again later.'
    })
  }
}

exports.registerVerifyOTP = async (req, res) => {
  try {
    // Extract the verification code and OTP from the request body
    const {
      VerificationCode,
      OTP,
      FirstName,
      LastName,
      Email,
      UserName,
      Password
    } = req.body

    const requiredFields = [
      'VerificationCode',
      'OTP',
      'FirstName',
      'LastName',
      'Email',
      'UserName',
      'Password'
    ]
    const missingFields = requiredFields.filter(field => !req.body[field])
    if (missingFields.length) {
      return res.status(400).send({
        message: `Missing fields: ${missingFields.join(', ')}`
      })
    }
    // Find the verification code in the database
    const verificationCode = await VerificationCodesModel.findOne({
      where: {
        VerificationCode
      }
    })

    // Check if the verification code was found
    if (!verificationCode) {
      return res.status(404).send({
        message: 'Verification code not found'
      })
    }

    // Check if the verification code has expired
    if (verificationCode.expiresAt < new Date()) {
      return res.status(400).send({
        message: 'Verification code has expired'
      })
    }

    // Check if the verification code has already been verified
    if (verificationCode.Verified) {
      return res.status(400).send({
        message: 'Verification code has already been verified'
      })
    }

    // Check if the OTP provided matches the stored OTP
    if (verificationCode.OTP !== OTP) {
      // Increment the number of attempts
      verificationCode.Attempts += 1
      await verificationCode.save() // Save the updated verification code

      // Check if the maximum number of attempts has been reached
      if (verificationCode.Attempts >= 3) {
        return res.status(400).send({
          message: 'Maximum number of attempts reached. Please try again later.'
        })
      }

      return res.status(400).send({
        message: 'Invalid OTP. Please try again.'
      })
    }

    // Update the verification code to mark it as verified
    verificationCode.Verified = true
    await verificationCode.save() // Save the updated verification code

    const checkEmailExists = await UsersModel.findOne({
      where: {
        Email
      }
    })
    if (checkEmailExists) {
      return res.status(400).send({
        message: 'Email already exists'
      })
    }

    const checkUserNameExists = await UsersModel.findOne({
      where: {
        UserName
      }
    })
    if (checkUserNameExists) {
      return res.status(400).send({
        message: 'UserName already exists'
      })
    }

    const createUser = await UsersModel.create({
      FirstName,
      LastName,
      Email,
      UserName,
      Password,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    const authToken = await createNewAuthToken({
      UserId: createUser.UserId
    })

    // Send a response indicating the OTP was verified successfully
    res.send({
      message: 'OTP verified successfully',
      user: createUser,
      authToken
    })
  } catch (error) {
    // Handle any errors that occur and send a generic error response
    console.error('Error while verifying OTP:', error)
    return res.status(500).send({
      message: 'Failed to verify OTP. Please try again later.'
    })
  }
}

exports.login = async (req, res) => {
  // Input validation schema using Joi
  const { email, password } = req.body
  const requiredFields = ['email', 'password']
  const missingFields = requiredFields.filter(field => !req.body[field])
  if (missingFields.length) {
    return res.status(400).send({
      message: `Missing fields: ${missingFields.join(', ')}`
    })
  }

  try {
    // Fetch user by email
    const user = await UsersModel.findOne({ where: { Email: email } })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

   // Compare passwords using bcrypt (async/await)
    const isMatch = await bcrypt.compare(password, user.Password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' })
    }

    // Generate auth token
    const authToken = await createNewAuthToken({ UserId: user.UserId })

    const userMetrics = await UserMetricsModel.findOne({
      where: { UserId: user.UserId }
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
        route: 'UserMetrics',
        authToken
      })
    }
    else{
      return res.status(200).json({
        message: 'Login successful',
        user: { UserId: user.UserId, Email: user.Email }, // Expose only safe user fields
        authToken
      })
    }
    // Send response
    
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
