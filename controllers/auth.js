const User = require("../models/User")
const ErrorResponse = require("../utilities/errorResponse")
const asyncHandler = require("../middleware/async")

// description  -- Register Users
// route        -- GET /api/auth/register
// access       -- Public
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body

  const user = await User.create({
    name,
    email,
    password,
    role,
  })

  const token = user.getSignedJWTToken()

  res.status(200).json({ success: true, token: token })
})

module.exports = { register }
