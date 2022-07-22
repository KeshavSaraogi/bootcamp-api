const express = require("express")
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps")

const courseRouter = require("./courses")
const reviewRouter = require("./reviews")

const results = require("../middleware/results")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

router.use("/:bootcampId/courses", courseRouter)
router.use("/:bootcampId/reviews", reviewRouter)

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius)

router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), bootcampPhotoUpload)

router
  .route("/")
  .get(results(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), createBootcamp)

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp)

module.exports = router
