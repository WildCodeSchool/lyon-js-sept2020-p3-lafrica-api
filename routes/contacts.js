const contactsRouter = require("express").Router();
const asyncHandler = require("express-async-handler");
const contactsController = require("../controllers/contacts");

contactsRouter.get("/", asyncHandler(contactsController.getCollection));
contactsRouter.post("/", asyncHandler(contactsController.createContacts));
contactsRouter.put(
  "/:id_contact",
  asyncHandler(contactsController.modifyContact)
);
contactsRouter.delete(
  "/:id_contact",
  asyncHandler(contactsController.deleteContact)
);

module.exports = contactsRouter;
