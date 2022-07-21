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

//Static Method to calculate average cost of courses tuition
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { avg: "$tuition" },
      },
    },
  ])
}

try {
  await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
    averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
  })
} catch (err) {
  console.log(err)
}

// Calculate Average Cost After Save
CourseSchema.post("save", function () {
  this.constructor.getAverageCost(this.bootcamp)
})

// Calculate Average Cost Before Remove
CourseSchema.pre("remove", function () {
  this.constructor.getAverageCost(this.bootcamp)
})

module.exports = mongoose.model("Course", CourseSchema)
