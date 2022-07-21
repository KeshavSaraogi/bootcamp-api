const Bootcamp = require("../models/Bootcamp")

// description  -- Get All Bootcamps
// route        -- GET /api/bootcamps
// access       -- Public
const getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await bootcamps.find()
    res
      .status(200)
      .json({ suceess: true, count: bootcamps.length, data: bootcamps })
  } catch (err) {
    res.status(400).json({ success: false })
  }
}

// description  -- Get Single Bootcamp
// route        -- GET /api/bootcamps/:id
// access       -- Public
const getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id)

    if (!bootcamp) {
      return res.status(400).json({ sucess: false })
    }
    res.status(200).json({ succeess: true, data: bootcamp })
  } catch (err) {
    res.status(400).json({ succeess: false })
  }
}

// description  -- Create New Bootcamp
// route        -- POST /api/bootcamps/:id
// access       -- Private
const createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body)

    res.status(201).json({
      success: true,
      data: bootcamp,
    })
  } catch (err) {
    res.status(400).json({ success: false })
    console.log(err)
  }
}

// description  -- Update Bootcamp
// route        -- PUT /api/bootcamps/:id
// access       -- Private
const updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!bootcamp) {
      res.status(400).json({ suceess: false })
    }

    res.status(200).json({ suceess: true, data: bootcamp })
  } catch (err) {
    res.status(400).json({ suceess: false })
  }
}

// description  -- Delete Bootcamp
// route        -- DELETE /api/bootcamps/:id
// access       -- Private
const deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

    if (!bootcamp) {
      res.status(400).json({ suceess: false })
    }

    res.status(200).json({ suceess: true, data: {} })
  } catch (err) {
    res.status(400).json({ suceess: false })
  }
}

module.exports = {
  getBootcamps: getBootcamps,
  getBootcamp: getBootcamp,
  createBootcamp: createBootcamp,
  updateBootcamp: updateBootcamp,
  deleteBootcamp: deleteBootcamp,
}
