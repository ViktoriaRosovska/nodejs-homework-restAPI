const { HttpError } = require("../helpers");
const { controllerWrapper } = require("../helpers");

const Contact = require("../models/contact.model");

const listContacts = async (req, res) => {
  const result = await Contact.find();
  res.status(200).json(result);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);
  if (!result) {
    throw HttpError(404, { " message ": " Not found " });
  }
  res.json(result);
};

const addNewContact = async (req, res) => {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndDelete(contactId, { new: true });
  if (!result) {
    throw HttpError(404, { " message ": " Not found " });
  }
  res.status(200).json({ message: "Contact deleted" });
};

const updateContactBody = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
  if (!result) {
    throw HttpError(404, { " message ": " Not found " });
  }
  res.status(200).json(result);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const { body } = req;

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
