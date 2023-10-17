const brcypt = require("bcrypt");
const path = require("path");
require("dotenv").config();
const gravatar = require("gravatar");

const User = require("../models/user.model");
const { controllerWrapper, HttpError, sendEmail } = require("../helpers");
const { jwtGenetator } = require("../utils/jwtGenerator");
const { userSubscription } = require("../utils/constants");
const { fileStorage } = require("../utils/aws.s3.filestorage");
const { resizeImage } = require("../utils/resizeImage");
const { nanoid } = require("nanoid");
// const { verify } = require("crypto");
require("dotenv").config();
const ejs = require("ejs");

// const avatarDir = path.join(__dirname, "../", "public", "avatars");
const tempDir = path.join(__dirname, "../", "temp");

const register = async (req, res) => {
  const { email, password } = req.body;
  let avatarURL = null;

  if (req.file) {
    const { path: tempUpload, originalname } = req.file;
    const imagePath = path.join(tempDir, originalname);
    resizeImage(tempUpload, imagePath);
    avatarURL = path.join(tempDir, originalname);
  } else {
    avatarURL = "http:" + gravatar.url(email) + "?s=200&d=identicon";
  }

  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email is already in use");
  }

  const hashPassword = await brcypt.hash(password, 10);

  const verificationToken = nanoid();

  const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken });
  let emailTemplate;
  ejs
    .renderFile(path.join(__dirname, "../", "templates/welcome.ejs"), {
      user_email: email,
      confirm_link: `${process.env.BASE_URL}/api/users/verify/${verificationToken}`,
    })
    .then((result) => {
      emailTemplate = result;

      const verifyEmail = {
        to: email,
        subject: "Verify email",
        // html: `<a target="_blank" href="${process.env.BASE_URL}/api/users/verify/${verificationToken}">Verify email</a>`,
        html: emailTemplate,
      };
      sendEmail(verifyEmail);
    });

  newUser.password = "";
  const payload = newUser._id;
  avatarURL = await fileStorage(req, newUser._id);

  const token = jwtGenetator(payload);

  await User.findByIdAndUpdate(newUser._id, { token, avatarURL });
  res.status(201).json({
    email: newUser.email,
    token,
    avatarURL,
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });
  res.status(200).json({ message: "Verification successful" });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${process.env.BASE_URL}/api/users/verify/${user.verificationToken}">Verify email</a>`,
  };
  await sendEmail(verifyEmail);
  res.status(200).json({ message: "Verification email sent" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }

  if (!user.verify) {
    throw HttpError(401, "Email is not verify");
  }

  const passwordCompare = await brcypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const payload = user._id;
  const token = jwtGenetator(payload);

  await User.findByIdAndUpdate(user._id, { token });

  const userAvatar = await User.findOne({ avatarURL: user.avatarURL });
  res
    .status(200)
    .json({ token, user: { email: user.email, subscription: user.subscription, avatarURL: userAvatar.avatarURL } });
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

const updateAvatar = async (req, res) => {
  const { _id, email } = req.user;
  let avatarURL = null;
  if (req.file) {
    const { path: tempUpload, originalname } = req.file;
    const imagePath = path.join(tempDir, originalname);
    resizeImage(tempUpload, imagePath);
    avatarURL = path.join(tempDir, originalname);
  } else {
    avatarURL = "http:" + gravatar.url(email) + "?s=200&d=identicon";
  }
  avatarURL = await fileStorage(req, _id);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(201).json({
    avatarURL,
  });
};

module.exports = {
  register: controllerWrapper(register),
  login: controllerWrapper(login),
  getCurrent: controllerWrapper(getCurrent),
  logout: controllerWrapper(logout),
  updateSubscription: controllerWrapper(updateSubscription),
  updateAvatar: controllerWrapper(updateAvatar),
  verifyEmail: controllerWrapper(verifyEmail),
  resendVerifyEmail: controllerWrapper(resendVerifyEmail),
};
