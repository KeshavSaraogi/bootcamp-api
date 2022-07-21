const Bootcamp = require("../models/Bootcamp")
const ErrorResponse = require("../utilities/errorResponse")
const geocoder = require("../utilities/geocoder")
const asyncHandler = require("../middleware/async")

// description  -- Get All Bootcamps
// route        -- GET /api/bootcamps
// access       -- Public
const getBootcamps = asyncHandler(async (req, res, next) => {
  let query

  const requestQuery = { ...req.query }

  const removeFields = ["select", "sort"]
  removeFields.forEach((param) => delete requestQuery[param])

  let queryStr = JSON.stringify(requestQuery)

  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)
  query = Bootcamp.find(JSON.parse(queryStr))

  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ")
    query = query.select(fields)
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ")
    query = query.sort(sortBy)
  } else {
    query = query.sort("-createdAt")
  }

  const bootcamps = await query
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

// description  -- Get Bootcamps Within a Radius
// route        -- GET /api/bootcamps/:zipcode/:distance
// access       -- Private
const getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params

  const location = await geocoder.geocode(zipcode)
  const latitude = location[0].latitude
  const longitude = location[0].longitude

  const radiusOfEarth = 3963

  const radius = distance / radiusOfEarth
  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
    },
  })
})

module.exports = {
  getBootcamps: getBootcamps,
  getBootcamp: getBootcamp,
  createBootcamp: createBootcamp,
  updateBootcamp: updateBootcamp,
  deleteBootcamp: deleteBootcamp,
  getBootcampsInRadius: getBootcampsInRadius,
}
