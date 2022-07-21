const path = require("path")
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

  const removeFields = ["select", "sort", "page", "limit"]
  removeFields.forEach((param) => delete requestQuery[param])

  let queryStr = JSON.stringify(requestQuery)

  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)
  query = Bootcamp.find(JSON.parse(queryStr)).populate("courses")

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

  // Pagination

  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 25
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Bootcamp.countDocuments()

  query = query.skip(startIndex).limit(limit)

  const bootcamps = await query

  //Pagination Result

  const pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }

  res.status(200).json({
    suceess: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  })
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
  const bootcamp = await Bootcamp.findById(req.params.id)

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp Not Found With Id ${req.params.id}`, 404)
    )
  }

  bootcamp.remove()

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

// description  -- Upload Photo For Bootcamp
// route        -- PUT /api/bootcamps/:id/photo
// access       -- Private
const bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp Not Found With Id ${req.params.id}`, 404)
    )
  }

  if (!req.files) {
    return next(new ErrorResponse("Please Upload A File", 400))
  }

  const file = req.files.file

  //Ensure File Upload Is An Image
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse("Please Upload A File", 400))
  }

  // Check For File Size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please Upload Image Less Than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    )
  }

  //Create Custom File Name

  file.name = `photo-${bootcamp._id}${path.parse(filename).ext}`

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err)
      return next(new ErrorResponse(`Problem With File Upload`, 500))
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name })

    res.status(200).json({
      success: true,
      data: file.name,
    })
  })
})

module.exports = {
  getBootcamps: getBootcamps,
  getBootcamp: getBootcamp,
  createBootcamp: createBootcamp,
  updateBootcamp: updateBootcamp,
  deleteBootcamp: deleteBootcamp,
  getBootcampsInRadius: getBootcampsInRadius,
  bootcampPhotoUpload: bootcampPhotoUpload,
}
