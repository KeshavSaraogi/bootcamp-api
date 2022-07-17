const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const bootcamps = require("./routes/bootcamps")

dotenv.config({ path: "./config/config.env" })

const app = express()

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

app.use("/api/bootcamps", bootcamps)

const PORT = process.env.PORT || 3000

app.listen(
  PORT,
  console.log(`Server Running In ${process.env.NODE_ENV} Mode on PORT ${PORT}`)
)
