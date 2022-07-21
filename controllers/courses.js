const Course = require("../models/Course")
const Bootcamp = require("../models/Bootcamp")
const ErrorResponse = require("../utilities/errorResponse")
const asyncHandler = require("../middleware/async")

// description  -- Get Courses
// route        -- GET /api/courses
// route        -- GET /api/bootcamps/:bootcampsId/courses
// access       -- Public
const getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId })

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    })
  } else {
    res.status(200).json(res.results)
  }
})

// description  -- Get Single Courses
// route        -- GET /api/courses/:id
// access       -- Public
const getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populated({
    path: "bootcamp",
    select: "name description",
  })

  if (!course) {
    return next(
      new ErrorResponse(`No Course With The Id: ${req.params.id}`),
      404
    )
  }

  res.status(200).json({
    success: true,
    data: course,
  })
})

// description  -- Add A Course
// route        -- POST /api/bootcamps/:bootcampId/courses
// access       -- Private
const addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId
  const bootcamp = await Bootcamp.findById(req.params.bootcampId)

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No Bootcamp With The Id: ${req.params.bootcampId}`),
      404
    )
  }

  const course = await Course.create(req.body)

  res.status(200).json({
    success: true,
    data: course,
  })
})

// description  -- Update Course
// route        -- PUT /api/courses/:id
// access       -- Private
const updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id)

  if (!course) {
    return next(
      new ErrorResponse(`No Course With The Id: ${req.params.id}`),
      404
    )
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: course,
  })
})

// description  -- Delete Course
// route        -- DELETE /api/courses/:id
// access       -- Private
const deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id)

  if (!course) {
    return next(
      new ErrorResponse(`No Course With The Id: ${req.params.id}`),
      404
    )
  }

  await course.remove()

  res.status(200).json({
    success: true,
    data: course,
    data: {},
  })
})

module.exports = {
  getCourses: getCourses,
  getCourse: getCourse,
  addCourse: addCourse,
  updateCourse: updateCourse,
  deleteCourse: deleteCourse,
}
