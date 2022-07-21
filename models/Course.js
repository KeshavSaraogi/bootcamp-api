const mongoose = require("mongoose")

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please Add a Course Title"],
  },
  description: {
    type: String,
    required: [true, "Please Add a Course Description"],
  },
  weeks: {
    type: String,
    required: [true, "Please Add a Duration In Terms of Weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please Add a Tuition Cost"],
  },
  minimumSkill: {
    type: Number,
    required: [true, "Please Add a Minimum Skill"],
    enum: ["Beginner", "Intermediate", "Advanced"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },

  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
})

module.exports = mongoose.model("Course", CourseSchema)
