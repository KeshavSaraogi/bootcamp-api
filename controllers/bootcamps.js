const path = require("path")
const Bootcamp = require("../models/Bootcamp")
const ErrorResponse = require("../utilities/errorResponse")
const geocoder = require("../utilities/geocoder")
const asyncHandler = require("../middleware/async")

// description  -- Get All Bootcamps
// route        -- GET /api/bootcamps
// access       -- Public
const getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.results)
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
  // add user to req.body
  req.body.user = req.user.id

  //Check for published bootcamps by this user
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id })

  //If the user is not admin, they can add only one bootcamp
  if (publishedBootcamp && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `The User With ID ${req.user.id} has already published a bootcamp`
      ),
      400
    )
  }

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
  let bootcamp = await Bootcamp.findById(req.params.id)

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp Not Found With Id ${req.params.id}`, 404)
    )
  }

  // Ensuring the user is the bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorised to update this bootcamp`
      ),
      401
    )
  }
  bootcamp = await Bootcamp.findById(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

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
  // Ensuring the user is the bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorised to delete this bootcamp`
      ),
      401
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

  // Ensuring the user is the bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorised to upload an image to this bootcamp`
      ),
      401
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
