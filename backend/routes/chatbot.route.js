import express from "express";
import { chatBot } from "../controllers/chatbot.controller.js";

const router = express();

router.route("/eventify/api/v1/ai-assistant/chatbot").post(chatBot);

export default router;