const express = require("express");

const controllers = require("../../controllers/contacts");
const { validateBody } = require("../../middlewares");
const contactSchema = require("../../schemas/contactsSchema");

const router = express.Router();

router.get("/", controllers.listContacts);

router.get("/:contactId", controllers.getContactById);

router.post("/", validateBody(contactSchema), controllers.addNewContact);

router.delete("/:contactId", controllers.deleteContact);

router.put("/:contactId", validateBody(contactSchema), controllers.updateContactBody);

module.exports = router;
