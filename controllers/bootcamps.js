// description  -- Get All Bootcamps
// route        -- GET /api/bootcamps
// access       -- Public
const getBootcamps = (req, res, next) => {
  res.send("Show All Bootcamps!")
}

// description  -- Get Single Bootcamp
// route        -- GET /api/bootcamps/:id
// access       -- Public
const getBootcamp = (req, res, next) => {
  res.send(`Show Bootcamp ${req.params.id}`)
}

// description  -- Create New Bootcamp
// route        -- POST /api/bootcamps/:id
// access       -- Private
const createBootcamp = (req, res, next) => {
  res.send("Create A New Bootcamp!")
}

// description  -- Update Bootcamp
// route        -- PUT /api/bootcamps/:id
// access       -- Private
const updateBootcamp = (req, res, next) => {
  res.send(`Update Bootcamp ${req.params.id}`)
}

// description  -- Delete Bootcamp
// route        -- DELETE /api/bootcamps/:id
// access       -- Private
const deleteBootcamp = (req, res, next) => {
  res.send(`Delete Bootcamp ${req.params.id}`)
}

module.exports = {
  getBootcamps: getBootcamps,
  getBootcamp: getBootcamp,
  createBootcamp: createBootcamp,
  updateBootcamp: updateBootcamp,
  deleteBootcamp: deleteBootcamp,
}
