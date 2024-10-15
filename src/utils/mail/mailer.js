const nodemailer = require('nodemailer')
const { systemConfig } = require('../../config/systemConfig')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: systemConfig.defaultMailAddress,
    pass: systemConfig.appPassword
  },
  port: 465
})

const sendMailUsingMailer = async mailOptions => {
  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  sendMailUsingMailer
}
