const User = require("../models/User")
const ErrorResponse = require("../utilities/errorResponse")
const asyncHandler = require("../middleware/async")

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

module.exports = {
  register: register,
  login: login,
  sendTokenResponse: sendTokenResponse,
  getMe: getMe,
}
