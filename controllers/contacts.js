const { HttpError } = require("../helpers");
const { controllerWrapper } = require("../helpers");

const Contact = require("../models/contact.model");

const listContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, favorite } = req.query;
  const skip = (page - 1) * limit;

  const total = await Contact.count({ owner });

  if (favorite) {
    const result = await Contact.find({ owner, favorite }, "-createAt -updateAt", { skip, limit }).populate(
      "owner",
      "email subscription"
    );

    res.status(200).json({ result, total });
  } else {
    const result = await Contact.find({ owner }, "-createAt -updateAt", { skip, limit }).populate(
      "owner",
      "email subscription"
    );

    res.status(200).json({ result, total });
  }
};

const getContactById = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req;
  const { contactId } = req.params;

  if (owner !== id) {
    throw HttpError(409);
  }
  const result = await Contact.findById(contactId).populate("owner", "email subscription");

  if (!result) {
    throw HttpError(404, { " message ": " Not found " });
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
  const { id } = req;
  const { contactId } = req.params;

  if (owner !== id) {
    throw HttpError(409);
  }
  const result = await Contact.findByIdAndDelete(contactId, { new: true });

  if (!result) {
    throw HttpError(404, { " message ": " Not found " });
  }
  res.status(200).json({ message: "Contact deleted" });
};

const updateContactBody = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req;
  const { contactId } = req.params;

  if (owner !== id) {
    throw HttpError(409);
  }
  const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
  if (!result) {
    throw HttpError(404, { " message ": " Not found " });
  }
  res.status(200).json(result);
};

const updateStatusContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req;
  const { contactId } = req.params;
  const { body } = req;

  if (owner !== id) {
    throw HttpError(409);
  }
  const result = await Contact.findByIdAndUpdate(contactId, { favorite: body.favorite }, { new: true });
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
