const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const path = require("path")
const xss = require("xss-clean")
const colors = require("colors")
const helmet = require("helmet")
const mongoSanitize = require("express-mongo-sanitize")
const cookieParser = require("cookie-parser")
const fileupload = require("express-fileupload")
const errorHandler = require("./middleware/error")
const bootcamps = require("./routes/bootcamps")
const connectDB = require("./config/db")

dotenv.config({ path: "./config/config.env" })

connectDB()

const bootcamps = require("./routes/bootcamps")
const courses = require("./routes/courses")
const auth = require("./routes/auth")
const users = require("./routes/users")
const reviews = require("./routes/reviews")

const app = express()
app.use(express.json())

app.use(cookieParser())

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

app.use(fileupload())

//Sanitising Data
app.use(mongoSanitize())

//Security
app.use(helmet())

//Prevent XSS attacks
app.use(xss())

app.use(express.static(path.join(__dirname, "public")))

app.use("/api/bootcamps", bootcamps)
app.use("/api/courses", courses)
app.use("/api/auth", auth)
app.use("/api/users", users)
app.use("/api/reviews", reviews)

app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(
  PORT,
  console.log(
    `Server Running In ${process.env.NODE_ENV} Mode on PORT ${PORT}`.yellow.bold
  )
)
