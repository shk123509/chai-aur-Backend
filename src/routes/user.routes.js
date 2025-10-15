import { Router } from "express";
import { loginUser, logutUser, registerUser, refreshAccessToken, getcurrentUser, currentUserCurrentPasswordChange, UpdateAccountUser, changeAvatarofUser, changedCoverImages, getcurrentuserchannel, getCurrentUserHistory } from "../controllers/user.js";
import { upload } from "../middleware/multer.middleware.js"
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();
router.route("/register").post(
   upload.fields([
    {
      name: "avatar",
      maxCount: 1
    },
    {
      name: "coverImage",
      maxCount: 1
    }
  ]),

    registerUser
)
router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logutUser)
router.route("/Refresh-token").post(refreshAccessToken)
router.route("/get-user").get(verifyJWT, getcurrentUser)
router.route("/password-change").post(verifyJWT, currentUserCurrentPasswordChange)
router.route("/update-acount-profiles").patch(verifyJWT, UpdateAccountUser)
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), changeAvatarofUser)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), changedCoverImages)
router.route("/c/:username").get(verifyJWT, getcurrentuserchannel)
router.route("/history").get(verifyJWT, getCurrentUserHistory)
export default router