const mongoose = require("mongoose")

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please Add a Title for the Review"],
    maxlength: 100,
  },
  text: {
    type: String,
    required: [true, "Please Add Some Text"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Please Add a Rating Between 1 and 10"],
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
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
})

// User can only submit one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true })

//Static Method to calculate average ratings and save
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageRating: { avg: "$rating" }, // calling the average operator on the rarting field
      },
    },
  ])
}

try {
  await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
    averageRating: obj[0].averageRating,
  })
} catch (err) {
  console.log(err)
}

// Calculate Average Cost After Save
ReviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.bootcamp)
})

// Calculate Average Cost Before Remove
ReviewSchema.pre("remove", function () {
  this.constructor.getAverageRating(this.bootcamp)
})

module.exports = mongoose.model("Review", ReviewSchema)
