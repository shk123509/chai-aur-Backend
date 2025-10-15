import { Router } from "express";
import { contact } from "../controllers/contact.js";

const router = Router();

router.route("/contact").post(contact)

export default router