const Bootcamp = require("../models/Bootcamp")
const ErrorResponse = require("../utilities/errorResponse")
const asyncHandler = require("../middleware/async")

// description  -- Get All Bootcamps
// route        -- GET /api/bootcamps
// access       -- Public
const getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await bootcamps.find()
  res
    .status(200)
    .json({ suceess: true, count: bootcamps.length, data: bootcamps })
})

// description  -- Get Single Bootcamp
// route        -- GET /api/bootcamps/:id
// access       -- Public
const getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp Not Found With Id ${req.params.id}`, 404)
    )
  }
  res.status(200).json({ succeess: true, data: bootcamp })
})

// description  -- Create New Bootcamp
// route        -- POST /api/bootcamps/:id
// access       -- Private
const createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body)

  res.status(201).json({
    success: true,
    data: bootcamp,
  })
})

// description  -- Update Bootcamp
// route        -- PUT /api/bootcamps/:id
// access       -- Private
const updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp Not Found With Id ${req.params.id}`, 404)
    )
  }

  res.status(200).json({ suceess: true, data: bootcamp })
})

// description  -- Delete Bootcamp
// route        -- DELETE /api/bootcamps/:id
// access       -- Private
const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp Not Found With Id ${req.params.id}`, 404)
    )
  }

  res.status(200).json({ suceess: true, data: {} })
})

module.exports = {
  getBootcamps: getBootcamps,
  getBootcamp: getBootcamp,
  createBootcamp: createBootcamp,
  updateBootcamp: updateBootcamp,
  deleteBootcamp: deleteBootcamp,
}
