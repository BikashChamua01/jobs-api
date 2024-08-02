const USER = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { BadRequestError } = require("../errors");
const { UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await USER.create({ ...req.body }); //Encryption of password using bcrypt in User.js in model using pre-save
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
    },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please rovide email and password");
  }

  const user = await USER.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid credential");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  console.log(isPasswordCorrect);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Wrong password");
  }
  const token = user.createJWT();

  return res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
    },
    token,
  });
};

module.exports = { register, login };
