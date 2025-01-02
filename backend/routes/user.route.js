import express from "express";
import { singleUpload } from "../middlewares/multer.js"
import { fetchUserDetail, login, logout, register, userDetail } from "../controllers/user.controller.js";

const router = express.Router();

router.route("/signup").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/edit/:id").post(singleUpload, userDetail);
router.route("/detail/:id").get(fetchUserDetail);

export default router;