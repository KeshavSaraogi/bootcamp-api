const jwt = require("jsonwebtoken")
const asyncHandler = require("./async")
const ErrorResponse = require("../utilities/errorResponse")
const User = require("../models/User")

//Protect Routes

const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authoeization.split(" ")[1]
  } //else if (req.cookies.token) {
  //token = req.cookies.token
  //}

  if (!token) {
    return next(
      new ErrorResponse("Not Authorized To Access This Resource"),
      401
    )
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log(decoded)

    req.user = await User.findById(decoded.id)
    next()
  } catch (err) {
    console.log(err)
    return next(
      new ErrorResponse("Not Authorized To Access This Resource"),
      401
    )
  }
})

// Grant Access To Specific Roles

const authorize = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User Role ${req.user.role} is not authorised access this route`
        ),
        403
      )
    }
    next()
  }
}

module.exports = {
  protect: protect,
  authorize: authorize,
}
