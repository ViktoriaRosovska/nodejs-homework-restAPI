const brcypt = require("bcrypt");
const path = require("path");
require("dotenv").config();
const gravatar = require("gravatar");

const User = require("../models/user.model");
const { controllerWrapper, HttpError } = require("../helpers");
const { jwtGenetator } = require("../utils/jwtGenerator");
const { userSubscription } = require("../utils/constants");
const { fileStorage } = require("../utils/aws.s3.filestorage");
const { resizeImage } = require("../utils/resizeImage");

// const avatarDir = path.join(__dirname, "../", "public", "avatars");
const tempDir = path.join(__dirname, "../", "temp");

const register = async (req, res) => {
  const { email, password } = req.body;
  let avatarURL = null;
  if (req.file) {
    const { path: tempUpload, originalname } = req.file;
    const imagePath = path.join(tempDir, originalname);
    resizeImage(tempUpload, imagePath);
    avatarURL = path.join("avatars", originalname);
  } else {
    avatarURL = "http:" + gravatar.url(email) + "?s=200&d=identicon";
  }

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
  const userAvatar = await User.findOne({ $group: { _id: user._id, avatarURL: "avatarURL" } });
  res.status(200).json({ token, user: { email: user.email, subscription: user.subscription, avatarURL: userAvatar } });
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
