const campaignsRouter = require("express").Router();

const asyncHandler = require("express-async-handler");
const campaignsController = require("../controllers/campaigns");
const handleTextUpload = require("../middlewares/handleTextUpload");

campaignsRouter.get("/", asyncHandler(campaignsController.getCollection));
campaignsRouter.post("/", asyncHandler(campaignsController.createCampaignId));

campaignsRouter.put(
  "/:campaignId",
  asyncHandler(campaignsController.updateCampaign)
);

campaignsRouter.post(
  "/uploadtext",
  handleTextUpload,
  asyncHandler(campaignsController.readText)
);

campaignsRouter.post("/TTS", asyncHandler(campaignsController.vocalization));
campaignsRouter.get("/audio", asyncHandler(campaignsController.playAudio));
campaignsRouter.get(
  "/downloadaudio",
  asyncHandler(campaignsController.downloadAudio)
);

campaignsRouter.get(
  "/:campaignId",
  asyncHandler(campaignsController.getOneCampaign)
);

campaignsRouter.put(
  "/:campaignId",
  asyncHandler(campaignsController.modifyOneCampaign)
);

campaignsRouter.get(
  "/:campaignId/exportStatistics",
  asyncHandler(campaignsController.exportStatistics)
);

module.exports = campaignsRouter;
