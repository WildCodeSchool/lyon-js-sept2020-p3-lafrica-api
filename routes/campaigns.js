const campaignsRouter = require("express").Router();

const asyncHandler = require("express-async-handler");
const campaignsController = require("../controllers/campaigns");
const handleTextUpload = require("../middlewares/handleTextUpload");

campaignsRouter.get(
  "/downloadaudio",
  asyncHandler(campaignsController.downloadAudio)
);

campaignsRouter.get("/video", asyncHandler(campaignsController.video));

campaignsRouter.get("/", asyncHandler(campaignsController.getCollection));
campaignsRouter.get("/audio", asyncHandler(campaignsController.playAudio));
// campaignsRouter.get('/template', asyncHandler(campaignsController.getTemplate));
campaignsRouter.get(
  "/:campaignId",
  asyncHandler(campaignsController.getOneCampaign)
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

campaignsRouter.put(
  "/:campaignId/stop",
  asyncHandler(campaignsController.stopCampaign)
);

campaignsRouter.delete(
  "/:campaignId",
  asyncHandler(campaignsController.deleteCampaign)
);

module.exports = campaignsRouter;
