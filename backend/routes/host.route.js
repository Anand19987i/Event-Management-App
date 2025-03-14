import express from "express";
import { singleUpload } from "../middlewares/multer.js"
import { fetchUserDetail, hostData, login, logout, markAsNotFirstTime, register, sendOtp, userDetail, verifyOtp } from "../controllers/host.controller.js";
import { authUser } from "../middlewares/tokenUtils.js"
const router = express.Router();

router.route("/signup").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/edit/:id").post(singleUpload, userDetail);
router.route("/detail/:id").get(fetchUserDetail);
router.route('/send-otp').post(sendOtp);
router.route('/verify-otp').post(verifyOtp);
router.route('/mark-as-not-first-time').put(authUser, markAsNotFirstTime);
router.route("/hostdata/dashboard/:hostId").get(hostData);

export default router;