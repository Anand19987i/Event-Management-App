import express from "express";
import { AiIntegration, bookEvent, checkBookingStatus, createEvent, deleteEvent, editUserEvent, fetchBookedEvents, getAllEvents, getEventDetails, getRecommendEventDetails, getUserEvents, recommendation } from "../controllers/event.controller.js";
import {singleUpload, Uploads } from "../middlewares/multer.js";

const router = express();

router.route("/host/event/:hostId").post(Uploads, createEvent);
router.route("/explore/events").get(getAllEvents);
router.route("/details/:eventTitle/:eventId").get(getEventDetails);
router.route("/list/events/:id").get(getUserEvents);
router.route("/edit/event/:id").post(Uploads, editUserEvent);
router.route("/delete/event/:id").delete(deleteEvent);
router.route("/ai/generate").post(AiIntegration);
router.route("/booked/event/:eventId").post(bookEvent);
router.route("/booked/status/:eventId").get(checkBookingStatus);
router.route("/list/booked/events/:userId").get(fetchBookedEvents);
router.route("/events/recommendation/:hostId").post(recommendation);
router.route("/recommend/detail/:hostId").get(getRecommendEventDetails);

export default router;