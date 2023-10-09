const brcypt = require("bcrypt");
const path = require("path");
require("dotenv").config();

const User = require("../models/user.model");
const { controllerWrapper, HttpError } = require("../helpers");
const { jwtGenetator } = require("../utils/jwtGenerator");
const { userSubscription } = require("../utils/constants");
const { fileStorage } = require("../utils/aws.s3.filestorage");

// const avatarDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { originalname } = req.file;
  let avatarURL = path.join("avatars", originalname);
  const { email, password } = req.body;
  console.log(req.file);

  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email is already in use");
  }

  const hashPassword = await brcypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL });
  newUser.password = "";
  const payload = newUser._id;
  avatarURL = await fileStorage(req, newUser._id);
  console.log(avatarURL);
  const token = jwtGenetator(payload);

  await User.findByIdAndUpdate(newUser._id, { token, avatarURL });
  res.status(201).json({
    email: newUser.email,
    token,
    avatarURL,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }

  const passwordCompare = await brcypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const payload = user._id;
  const token = jwtGenetator(payload);

  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({ token, user: { email: user.email, subscription: user.subscription } });
};

const getCurrent = async (req, res) => {
  const { email } = req.user;
  res.status(200).json({ email });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json({ message: "Logout success" });
};

const updateSubscription = async (req, res) => {
  const { _id, email } = req.user;
  const { subscription } = req.query;

  if (!userSubscription.includes(subscription)) {
    throw HttpError(404, "Unknown subscription type");
  }

  await User.findByIdAndUpdate(_id, { subscription: subscription }, { new: true });
  res.status(200).json({ email, subscription });
};

module.exports = {
  register: controllerWrapper(register),
  login: controllerWrapper(login),
  getCurrent: controllerWrapper(getCurrent),
  logout: controllerWrapper(logout),
  updateSubscription: controllerWrapper(updateSubscription),
};
