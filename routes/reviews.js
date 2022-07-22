const express = require("express")
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviews")

const Review = require("../models/Review")
const results = require("../middleware/results")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router({ mergeParams: true })

router
  .route("/")
  .get(
    results("Reviews", {
      path: "bootcamp",
      select: "name description",
    }),
    getReviews
  )
  .post(protect, authorize("user", "admin"), addReview)

router
  .route("/:id")
  .post(getReview)
  .put(protect, authorize("user", "admin"), updateReview)
  .delete(protect, authorize("user", "admin"), deleteReview)

module.exports = router
