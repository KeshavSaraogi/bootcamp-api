const fs = require("fs")
const mongoose = require("mongoose")
const colors = require("colors")
const dotenv = require("dotenv")

dotenv.config({ path: "./config/config.env" })

const Bootcamp = require("./models/Bootcamp")
const Course = require("./models/Courses")

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

//Import Data

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps)
    await Course.create(courses)
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
