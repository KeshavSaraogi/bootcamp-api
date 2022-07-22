const User = require("../models/User")
const ErrorResponse = require("../utilities/errorResponse")
const asyncHandler = require("../middleware/async")

// description  -- Get All Users
// route        -- GET /api/auth/users
// access       -- Private/Admin
const getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.results)
})

// description  -- Get Single Users
// route        -- GET /api/auth/users/:id
// access       -- Private/Admin
const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
  res.status(200).json({
    success: true,
    data: user,
  })
})

// description  -- Create User
// route        -- POST /api/auth/users
// access       -- Private/Admin
const createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body)

  res.status(201).json({
    success: true,
    data: user,
  })
})

// description  -- Update User
// route        -- PUT /api/auth/users/:id
// access       -- Private/Admin
const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: user,
  })
})

// description  -- Delete User
// route        -- DELETE /api/auth/users/:id
// access       -- Private/Admin
const deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id)

  res.status(200).json({
    success: true,
    data: {},
  })
})

module.exports = {
  getUsers: getUsers,
  getUser: getUser,
  createUser: createUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
}
