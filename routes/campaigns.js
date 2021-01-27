const campaignsRouter = require("express").Router();

const asyncHandler = require("express-async-handler");
const campaignsController = require("../controllers/campaigns");
const handleTextUpload = require("../middlewares/handleTextUpload");

campaignsRouter.get("/", asyncHandler(campaignsController.getCollection));
campaignsRouter.get("/audio", asyncHandler(campaignsController.playAudio));
campaignsRouter.get(
  "/:campaignId",
  asyncHandler(campaignsController.getOneCampaign)
);
campaignsRouter.get(
  "/downloadaudio",
  asyncHandler(campaignsController.downloadAudio)
);

campaignsRouter.post("/", asyncHandler(campaignsController.createCampaignId));
campaignsRouter.post(
  "/uploadtext",
  handleTextUpload,
  asyncHandler(campaignsController.readText)
);

campaignsRouter.post("/TTS", asyncHandler(campaignsController.vocalization));

campaignsRouter.put(
  "/:campaignId",
  asyncHandler(campaignsController.updateCampaign)
);

campaignsRouter.get(
  "/:campaignId/exportStatistics",
  asyncHandler(campaignsController.exportStatistics)
);
campaignsRouter.delete(
  "/:campaignId",
  asyncHandler(campaignsController.deleteCampaign)
);

module.exports = campaignsRouter;
