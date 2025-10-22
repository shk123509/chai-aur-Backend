
import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/ video.js"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { upload } from "../middleware/multer.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file
// 🎬 GET route – fetch all videos
router.get("/all", getAllVideos);

// 📤 POST route – upload/publish a video
router.post("/publish",
    upload.fields([
        { name: "videoFile", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 },
    ]),
    publishAVideo
);
router.get("/:videoId", getVideoById);

// DELETE a video by ID
router.delete("/:videoId", deleteVideo);

// PATCH (update) a video by ID
router.patch(
  "/:videoId",
  upload.single("thumbnail"),
  updateVideo
);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router
