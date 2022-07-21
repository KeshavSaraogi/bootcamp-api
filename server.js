const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const bootcamps = require("./routes/bootcamps")
const connectDB = require("./config/db")
const colors = require("colors")

dotenv.config({ path: "./config/config.env" })

connectDB()

const app = express()
app.use(express.json())

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

app.use("/api/bootcamps", bootcamps)

const PORT = process.env.PORT || 3000

app.listen(
  PORT,
  console.log(
    `Server Running In ${process.env.NODE_ENV} Mode on PORT ${PORT}`.yellow.bold
  )
)
