const ErrorResponse = require("../utilities/errorResponse")

const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  console.log(err)

  if (err.name === "CastError") {
    const message = `Resource Not Found With Id: ${err.value}`
    error = new ErrorResponse(message, 404)
  }

  if (err.code === 11000) {
    const message = "Duplicate Field Value Entered"
    error = new ErrorResponse(message, 400)
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message)
    error = new ErrorResponse(message, 400)
  }

  res
    .status(error.statusCode || 500)
    .json({ suceess: false, error: error.message || "Server Error" })
}

module.exports = errorHandler
