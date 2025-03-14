import express from "express";
import { AiIntegration, bookEvent, cancelBooking, checkBookingStatus, createEvent, dashboard, deleteEvent, editUserEvent, fetchBookedEvents, fetchUserWhoBookedEvent, getAllEvents, getEventDetail, getEventDetails, getRecommendEventDetails, getRelatedEvents, getUserEvents, initiateRazorpayPayment, razorpayCallback, recommendation, searchEvents, seatSelection } from "../controllers/event.controller.js";
import {singleUpload, Uploads } from "../middlewares/multer.js";

const router = express();

router.route("/host/event/:hostId").post(Uploads, createEvent);
router.route("/explore/events").get(getAllEvents);
router.route("/details/:eventTitle/:eventId").get(getEventDetails);
router.route("/details/:eventId").get(getEventDetails);
router.route("/:eventId").get(getEventDetail);
router.route("/list/events/:id").get(getUserEvents);
router.route("/edit/event/:id").post(Uploads, editUserEvent);
router.route("/delete/event/:id").delete(deleteEvent);
router.route("/ai/generate").post(AiIntegration);
router.route("/booked/event/:eventId").post(bookEvent);
router.route("/booked/status/:eventId").get(checkBookingStatus);
router.route("/list/booked/events/:userId").get(fetchBookedEvents);
router.route("/events/recommendation/:userId").post(recommendation);
router.route("/recommend/detail/:userId").get(getRecommendEventDetails);
router.route("/no-of-bookings/:eventId").get(fetchUserWhoBookedEvent);
router.route("/related/events/:eventType").get(getRelatedEvents);
router.route("/search/query/:query").get(searchEvents);
router.route("/dashboard/:hostId").get(dashboard);
router.route("/seat-selection/:eventId").post(seatSelection);
router.route("/payment/razorpay").post(initiateRazorpayPayment);
router.route("/payment/razorpay/callback").post(razorpayCallback);
router.post("/cancel-booking/:eventId", cancelBooking);

export default router;