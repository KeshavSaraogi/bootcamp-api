const mongoose = require("mongoose")
const slugify = require("slugify")
const geocoder = require("../utilities/geocoder")

const BootcampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter a Name"],
      unique: true,
      trime: true,
      maxLength: [50, "Name Cannot Exceed 50 Characters"],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Please Enter a Name"],
      unique: true,
      trime: true,
      maxLength: [500, "Description Cannot Exceed 500 Characters"],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please use a valid URL with HTTP or HTTPS",
      ],
    },
    phone: {
      type: String,
      maxLength: [20, "Phone Number Cannot Exceed 20 Characters"],
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    address: {
      type: String,
      required: [true, "Please Add Address"],
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
        index: "2dsphere",
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      type: [String],
      required: true,
      enum: [
        "Web Development",
        "Mobile Development",
        "UI/UX",
        "Data Science",
        "Business",
        "Other",
      ],
    },
    averageRating: {
      type: Number,
      min: [1, "Rating Must Be At Least 1"],
      max: [10, "Rating Cannot Exceed 10"],
    },
    averageCost: Number,
    photo: {
      type: String,
      default: "No-Photo.jpg",
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

BootcampSchema.pre("save", function () {
  this.slug = slugify(this.name, { lower: true })
  next()
})

BootcampSchema.pre("save", async function () {
  const location = await geocoder.geocode(this.address)
  this.location = {
    type: "Point",
    coordinates: [location[0].longitude, location[0].latitude],
    formattedAddress: location[0].formattedAddress,
    street: location[0].street,
    city: location[0].city,
    state: location[0].stateCode,
    zipcode: location[0].zipcode,
    country: location[0].countryCode,
  }

  //Do Not Save Address In DB
  this.address = undefined

  next()
})

// Cascade Delete Courses When a Bootcamp Is Deleted

BootcampSchema.pre("remove", async function (next) {
  console.log(`Courses Being Removed From Bootcamp With Id ${this._id}`)
  await this.model("Course").deleteMany({ bootcamp: this._id })
  next()
})

// Reverse Populate With Virtuals

BootcampSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "bootcamp",
  justOne: false,
})

module.exports = mongoose.model("Bootcamp", BootcampSchema)
