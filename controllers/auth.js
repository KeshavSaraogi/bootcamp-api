const User = require("../models/User")
const ErrorResponse = require("../utilities/errorResponse")
const asyncHandler = require("../middleware/async")
const sendEmail = require("../utilities/sendEmail")
const crypto = require("crypto")

// description  -- Register Users
// route        -- POST /api/auth/register
// access       -- Public
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body

  const user = await User.create({
    name,
    email,
    password,
    role,
  })

  sendTokenResponse(user, 200, res)
})

// description  -- Login User
// route        -- GET /api/auth/login
// access       -- Public
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return next(new ErrorResponse("Please Provide Email and Password"), 400)
  }

  const user = await User.findOne({ email: email }).select("+password")
  if (!user) {
    return next(new ErrorResponse("Invalid Credentials"), 401)
  }

  const isMatch = await user.matchPassword(password)
  if (!isMatch) {
    return next(new ErrorResponse("Invalid Credentials"), 401)
  }

  sendTokenResponse(user, 200, res)
})

// Get Token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJWTToken()

  const options = {
    expires: newDate(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }

  if (process.env.NODE_ENV === "production") {
    options.secure = true
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token: token })
}

// description  -- Get Current Logged In User
// route        -- GET /api/auth/me
// access       -- Private

const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user)

  res.status(200).json({ success: true, data: user })
})

// description  -- Forgot Password
// route        -- GET /api/auth/forgotPassword
// access       -- Private
const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next(new ErrorResponse("No User With This Email"), 404)
  }
  // Get Reset token
  const resetToken = user.getResetPasswordToken()

  await user.save({ validateBeforeSave: false })

  const resetURL = `${
    req.protocol
  }://${req.getHost()}/api/auth/resetpassword/${resetToken}`

  const message = `You are recieving this email because you have requested the reset of a password. 
  Please make a PUT request to: \n\n ${resetURL}`

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Token",
      message: message,
    })
    res.status(200).json({ Success: true, data: "Email Sent" })
  } catch (err) {
    console.log(err)
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save({ validateBeforeSave: false })
    return next(new ErrorResponse("Email Could Not Be Sent"), 500)
  }
  res.status(200).json({ success: true, data: user })
})

// description  -- Reset Password
// route        -- PUT /api/auth/resetpassword/:resettoken
// access       -- Public

const resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex")

  const user = await User.findByOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  })

  if (!user) {
    return next(new ErrorResponse("Invalid Token"), 400)
  }

  //Set new password
  user.password = req.body.password

  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined

  await user.save()
  sendTokenResponse(user, 200, res)
})

module.exports = {
  register: register,
  login: login,
  sendTokenResponse: sendTokenResponse,
  getMe: getMe,
  forgotPassword: forgotPassword,
  resetPassword: resetPassword,
}
