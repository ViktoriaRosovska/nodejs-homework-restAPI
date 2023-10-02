const express = require("express");

const controllers = require("../../controllers/contacts");
const { validateBody, isValidId, authenticate } = require("../../middlewares");
const schema = require("../../schemas/schema");

const contactRouter = express.Router();

contactRouter.get("/", authenticate, controllers.listContacts);

contactRouter.get("/:contactId", authenticate, isValidId, controllers.getContactById);

contactRouter.post("/", authenticate, validateBody(schema.contactSchema), controllers.addNewContact);

contactRouter.delete("/:contactId", authenticate, isValidId, controllers.deleteContact);

contactRouter.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(schema.contactSchema),
  controllers.updateContactBody
);

contactRouter.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(schema.favoriteSchema),
  controllers.updateStatusContact
);

module.exports = contactRouter;
