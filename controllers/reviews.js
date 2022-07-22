const Review = require("../models/Review")
const Bootcamp = require("../models/Bootcamp")
const ErrorResponse = require("../utilities/errorResponse")
const asyncHandler = require("../middleware/async")

// description  -- Get Reviews
// route        -- GET /api/reviews
// access       -- Public
const getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId })

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    })
  } else {
    res.status(200).json(res.results)
  }
})

// description  -- Get Single Review
// route        -- GET /api/reviews/:id
// access       -- Public

const getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  })

  if (!review) {
    return next(
      new ErrorResponse(`No Review Found With Id: ${req.params.id}`, 404)
    )
  }
  res.status(200).json({
    success: true,
    data: review,
  })
})

// description  -- Add Review
// route        -- POST /api/bootcamp/:bootcampId/reviews
// access       -- Private

const addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId
  req.body.user = req.user.id

  const bootcamp = await Bootcamp.findById(req.params.bootcampId)

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No Bootcamp Found With Id: ${req.params.bootcampId}`,
        404
      )
    )
  }

  const review = await Review.create(req.body)

  res.status(201).json({
    success: true,
    data: review,
  })
})

// description  -- Update Review
// route        -- PUT /api/reviews/:id
// access       -- Private

const updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.bootcampId)

  if (!review) {
    return next(
      new ErrorResponse(
        `No Review Found With Id: ${req.params.bootcampId}`,
        404
      )
    )
  }

  //Ensure Review belongs to the user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not Authorized to Update Reviews`, 401))
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: review,
  })
})

// description  -- Delete Review
// route        -- DELETE /api/reviews/:id
// access       -- Private

const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.bootcampId)

  if (!review) {
    return next(
      new ErrorResponse(
        `No Review Found With Id: ${req.params.bootcampId}`,
        404
      )
    )
  }

  //Ensure Review belongs to the user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not Authorized to Update Reviews`, 401))
  }

  await Review.remove()

  res.status(200).json({
    success: true,
    data: {},
  })
})

module.exports = {
  getReviews: getReviews,
  getReview: getReview,
  addReview: addReview,
  updateReview: updateReview,
  deleteReview: deleteReview,
}
