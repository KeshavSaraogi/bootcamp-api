const Course = require("../models/Course")
const ErrorResponse = require("../utilities/errorResponse")
const asyncHandler = require("../middleware/async")

// description  -- Get Courses
// route        -- GET /api/courses
// route        -- GET /api/bootcamps/:bootcampsId/courses
// access       -- Public
const getCourses = asyncHandler(async (req, res, next) => {
  let query

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId })
  } else {
    query = Course.find()
  }

  const courses = await query

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  })
})

module.exports = {
  getCourses: getCourses,
}
