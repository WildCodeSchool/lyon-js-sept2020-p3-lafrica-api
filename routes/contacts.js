const contactsRouter = require("express").Router();
const asyncHandler = require("express-async-handler");
const contactsController = require("../controllers/contacts");
const handleContactUpload = require("../middlewares/handleContactsUpload");

contactsRouter.get(
  "/",
  asyncHandler(contactsController.getCollectionForCampaign)
);
contactsRouter.post("/", asyncHandler(contactsController.createContacts));
contactsRouter.put(
  "/:id_contact",
  asyncHandler(contactsController.modifyContact)
);
contactsRouter.delete(
  "/:id_contact",
  asyncHandler(contactsController.deleteContact)
);

contactsRouter.post(
  "/upload",
  handleContactUpload,
  asyncHandler(contactsController.readContacts)
);

contactsRouter.get(
  "/exportContacts",
  asyncHandler(contactsController.exportContacts)
);

contactsRouter.get(
  "/exportStatistics",
  asyncHandler(contactsController.exportStatistics)
);

module.exports = contactsRouter;
