const fs = require("fs")
const mongoose = require("mongoose")
const colors = require("colors")
const dotenv = require("dotenv")

dotenv.config({ path: "./config/config.env" })

const Bootcamp = require("./models/Bootcamp")
const Course = require("./models/Courses")
const User = require("./models/User")
const Review = require("./models/Review")

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //   useFindAndModify: false,
  useUnifiedTopology: true,
})

//Read JSON files

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
)

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
)

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
)

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, "utf-8")
)

//Import Data

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps)
    await Course.create(courses)
    await User.create(users)
    await Review.create(reviews)
    console.log("Data Imported...".green.inverse)
    process.exit(1)
  } catch (err) {
    console.error(err)
  }
}

// Delete Data

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany(bootcamps)
    await Course.deleteMany(courses)
    await User.deleteMany(users)
    await Review.deleteMany(reviews)
    console.log("Data Destroyed...".red.inverse)
    process.exit(1)
  } catch (err) {
    console.error(err)
  }
}

if (process.argv[2] === "-i") {
  importData()
} else if (process.argv[2] === "-d") {
  deleteData()
}
