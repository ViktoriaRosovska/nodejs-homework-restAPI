const express = require("express");

const controllers = require("../../controllers/contacts");
const { validateBody } = require("../../middlewares");
const schema = require("../../schemas/schema");
const isValidId = require("../../middlewares/isValidId");

const router = express.Router();

router.get("/", controllers.listContacts);

router.get("/:contactId", isValidId, controllers.getContactById);

router.post("/", validateBody(schema.contactSchema), controllers.addNewContact);

router.delete("/:contactId", isValidId, controllers.deleteContact);

router.put("/:contactId", isValidId, validateBody(schema.contactSchema), controllers.updateContactBody);

router.patch("/:contactId/favorite", isValidId, validateBody(schema.favoriteSchema), controllers.updateStatusContact);

module.exports = router;
