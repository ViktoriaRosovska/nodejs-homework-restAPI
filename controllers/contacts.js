const { HttpError } = require("../helpers");
const { controllerWrapper } = require("../helpers");

const Contact = require("../models/contact.model");

const listContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  let favorite = req.query.favorite ?? "";
  const total = await Contact.count({ owner });

  switch (favorite.toLowerCase()) {
    case "true":
    case "t":
    case "yes":
    case "y":
      favorite = true;
      break;

    case "false":
    case "f":
    case "no":
    case "n":
      favorite = false;
      break;

    default:
      favorite = undefined;
      break;
  }

  let result;
  if (favorite === true || favorite === false) {
    result = await Contact.find({ owner, favorite }, "-createAt -updateAt", {
      skip,
      limit,
    }).populate("owner", "email subscription");
  } else {
    result = await Contact.find({ owner }, "-createAt -updateAt", {
      skip,
      limit,
    }).populate("owner", "email subscription");
  }

  res.status(200).json({ result, total });
};

const getContactById = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;

  const result = await Contact.findOne({ _id: contactId, owner }).populate("owner", "email subscription");

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const addNewContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const deleteContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;

  const result = await Contact.findOneAndRemove({ _id: contactId, owner }, { new: true });

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({ message: "Contact deleted" });
};

const updateContactBody = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;

  const result = await Contact.findOneAndUpdate({ _id: contactId, owner }, req.body, { new: true });
  if (!result) {
    throw HttpError(404, { " message ": " Not found " });
  }
  res.status(200).json(result);
};

const updateStatusContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;
  const { body } = req;

  const result = await Contact.findOneAndUpdate({ _id: contactId, owner }, { favorite: body.favorite }, { new: true });

  if (!result) {
    throw HttpError(404, { " message ": " Not found " });
  }
  res.status(200).json(result);
};

module.exports = {
  listContacts: controllerWrapper(listContacts),
  getContactById: controllerWrapper(getContactById),
  addNewContact: controllerWrapper(addNewContact),
  deleteContact: controllerWrapper(deleteContact),
  updateContactBody: controllerWrapper(updateContactBody),
  updateStatusContact: controllerWrapper(updateStatusContact),
};
