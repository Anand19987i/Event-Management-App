import cloudinary from '../config/cloudinary.js';
import getDataUri from '../config/datauri.js';
import { Event } from '../models/event.model.js';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai"
import { User } from '../models/user.model.js';
import crypto from "crypto"
import Razorpay from "razorpay";
import { UserEventInteraction } from '../models/recommendation.model.js';
import { Host } from '../models/host.model.js';
import PDFDocument from "pdfkit";
import fs from "fs";
import nodemailer from "nodemailer";
import qr from "qr-image";
import moment from "moment";
dotenv.config({});

export const createEvent = async (req, res) => {
  try {
    const { eventTitle, eventType, eventArtist, eventDescription, eventLocation, ticketPrice, state, eventDate, startTime, startTimePeriod, endTime, endTimePeriod, totalSeats } = req.body;
    const { hostId } = req.params;
    const { eventPoster } = req.files;
    const eventPosterUri = getDataUri(eventPoster[0]);
    const cloudPosterResponse = await cloudinary.uploader.upload(eventPosterUri);
    const newEvent = await Event.create({
      hostId: hostId,
      eventTitle,
      eventType,
      eventArtist,
      eventDescription,
      eventLocation,
      ticketPrice,
      state,
      eventDate,
      eventPoster: cloudPosterResponse.secure_url,
      startTime,
      startTimePeriod,
      endTime,
      endTimePeriod,
      totalSeats,
    });
    await Host.findByIdAndUpdate(
      hostId,
      { $push: { hostedEvents: newEvent._id } },
      { new: true, useFindAndModify: false }
    );
    return res.status(201).json({
      message: 'Event created successfully',
      success: true,
      createEvent: newEvent,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal Server Error',
      success: false,
    });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("hostId", "name")
      .select('eventTitle eventPoster ticketPrice eventArtist eventType eventLocation').sort({ createdAt: -1 });

    return res.status(200).json({ success: true, events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getEventDetails = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid Event ID' });
    }

    const eventDetail = await Event.findById(eventId).select("eventTitle eventDescription eventArtist eventPoster ticketPrice state eventDate eventLocation eventType startTime endTime startTimePeriod endTimePeriod totalSeats bookedSeats booked");

    if (!eventDetail) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    return res.status(200).json({ success: true, eventDetail });
  } catch (error) {
    console.error('Error fetching event details:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getEventDetail = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid Event ID' });
    }

    const event = await Event.findById(eventId).select("eventTitle eventDescription eventArtist eventPoster ticketPrice state eventDate eventLocation eventType startTime endTime startTimePeriod endTimePeriod totalSeats bookedSeats booked");

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    return res.status(200).json({ success: true, event });
  } catch (error) {
    console.error('Error fetching event details:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


export const getUserEvents = async (req, res) => {
  try {
    const { id } = req.params;
    const hostId = id;
    const userEvents = await Event.find({ hostId }).select("eventTitle eventPoster ticketPrice eventArtist eventType eventLocation").sort({ createdAt: -1 });
    return res.status(201).json({ success: true, userEvents });
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
export const editUserEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { eventTitle, eventArtist, eventDescription, eventType, eventDate, ticketPrice, eventLocation, state, endTime, startTime, startTimePeriod, endTimePeriod, totalSeats } = req.body;
    let { eventPoster } = req.files;

    // Check if eventPoster and eventPoster are provided
    let cloudPosterResponse = null;

    if (eventPoster && eventPoster.length > 0) {
      const eventPosterUri = getDataUri(eventPoster[0]);
      cloudPosterResponse = await cloudinary.uploader.upload(eventPosterUri);
    }

    const existingEvent = await Event.findById(id);

    const editEvent = await Event.findOneAndUpdate(
      { _id: id },
      {
        eventTitle,
        eventDescription,
        eventType,
        eventArtist,
        eventDate,
        ticketPrice,
        eventLocation,
        eventPoster: cloudPosterResponse ? cloudPosterResponse.secure_url : existingEvent.eventPoster,
        state,
        endTime,
        endTimePeriod,
        startTime,
        startTimePeriod,
        totalSeats,
      },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Edited Successfully",
      editUserEvent: editEvent,
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUserEvent = await Event.findByIdAndDelete(id);
    return res.status(201).json({ success: true, message: "Deleted Successfully", deleteEvent: deleteUserEvent });
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

export const bookEvent = async (req, res) => {
  try {
    const { userId } = req.body; // Extract userId from the request body
    const { eventId } = req.params; // Extract eventId from the URL parameters

    // Fetch the event by ID and populate the host details
    const event = await Event.findById(eventId).populate("hostId");
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // Check if the event is fully booked
    if (event.booked.length >= event.totalSeats) {
      return res.status(400).json({ message: "Event is fully booked." });
    }

    // Check if the user has already booked this event
    if (event.booked.includes(userId)) {
      return res.status(400).json({ message: "You have already booked this event." });
    }

    // Add ticket price to event total revenue and user to the booked array
    event.totalRevenue += event.ticketPrice;
    event.booked.push(userId);
    await event.save();

    // Update host's allTimeRevenue and allTimeTicketSold
    const host = event.hostId; // Host details populated from Event
    if (!host) {
      return res.status(404).json({ message: "Host not found." });
    }

    host.allTimeRevenue += Number(event.ticketPrice);// Update all-time revenue
    host.allTimeTicketSold += 1; // Increment all-time ticket sold count
    console.log(host.allTimeRevenue, typeof host.allTimeRevenue);

    await host.save();

    // Fetch the user by ID and add the event to their bookedEvents array
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.bookedEvents.push(eventId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Event booked successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while booking the event.",
      success: false,
    });
  }
};

export const checkBookingStatus = async (req, res) => {
  try {
    const { userId } = req.query;
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    const isBooked = event.booked.includes(userId)
    if (isBooked) {
      return res.status(200).json({ success: true, message: "Event is already booked" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while booking the event." });
  }
}

export const fetchBookedEvents = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId).populate({
      path: "bookedEvents",
      select: "eventTitle eventPoster ticketPrice eventArtist eventType eventLocation",
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // If user exists, return booked events
    return res.status(200).json({
      success: true,
      message: "Fetched booked events successfully.",
      bookedEvents: user.bookedEvents,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred while fetching booked events." });
  }
};

export const fetchUserWhoBookedEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({ success: false, message: "Invalid event ID." });
    }

    const event = await Event.findById(eventId).populate({
      path: "booked.userId", // Corrected populate path
      select: "firstname lastname email mobile",
    });

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Users who booked the event retrieved successfully!",
      bookedUsers: event.booked,
    });
  } catch (error) {
    console.error("Error fetching users who booked the event:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching users.",
    });
  }
};


export const AiIntegration = async (req, res) => {
  const { query } = req.body;
  if (!query || !query.trim()) {
    return res.status(400).json({ message: "Please provide a valid query." });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(query);
    return res.status(200).json({
      success: true,
      response: result.response.text(),
    });

  } catch (error) {
    console.error('Error communicating with Gemini AI:', error);

    return res.status(500).json({
      success: false,
      message: 'Error communicating with Gemini AI.',
    });
  }
};

export const recommendation = async (req, res) => {
  const { selectedTypes, deselectedTypes } = req.body;
  const { userId } = req.params;

  try {
    if (selectedTypes && selectedTypes.length > 0) {
      // Find events matching selected types
      const selectedEvents = await Event.find({ eventType: { $in: selectedTypes } });
      const selectedEventIds = selectedEvents.map(event => event._id);

      console.log("IDs", selectedEventIds);
      await UserEventInteraction.findOneAndUpdate(
        { userId: userId },
        {
          $addToSet: {
            eventIds: { $each: selectedEventIds },
            selectedTypes: { $each: selectedTypes },
          },
        },
        { new: true, upsert: true }
      );
    }

    if (deselectedTypes && deselectedTypes.length > 0) {
      // Find events matching deselected types
      const deselectedEvents = await Event.find({ eventType: { $in: deselectedTypes } });
      const deselectedEventIds = deselectedEvents.map(event => event._id);

      // Remove events and types from UserEventInteraction
      await UserEventInteraction.findOneAndUpdate(
        { userId: userId },
        {
          $pull: {
            eventIds: { $in: deselectedEventIds },
            selectedTypes: { $in: deselectedTypes },
          },
        },
        { new: true }
      );
    }

    // Fetch and return the updated interaction with populated event details
    const updatedInteraction = await UserEventInteraction.findOne({ userId: userId })
      .populate('eventIds');

    res.status(200).json({
      events: updatedInteraction.eventIds, // Populated event details
      selectedTypes: updatedInteraction.selectedTypes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getRecommendEventDetails = async (req, res) => {
  const { hostId } = req.params;

  try {
    const userInteraction = await UserEventInteraction.findOne({ hostId: hostId }).populate('eventIds');

    if (!userInteraction) {
      return res.status(404).json({ message: 'No events found for this user' });
    }
    console.log(userInteraction.eventIds.eventTitle);
    res.status(200).json({ events: userInteraction.eventIds });
  } catch (error) {
    console.error('Error fetching event details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRelatedEvents = async (req, res) => {
  const { eventType } = req.params;
  try {
    const relatedEvents = await Event.find({ eventType }).select("eventTitle eventDescription eventArtist eventPoster ticketPrice state eventDate eventLocation eventType startTime endTime startTimePeriod endTimePeriod totalSeats booked");
    if (relatedEvents.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No related events found",
      });
    }

    return res.status(200).json({
      success: true,
      events: relatedEvents
    });
  } catch (error) {
    console.error("Error fetching related events:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export const searchEvents = async (req, res) => {
  try {
    const query = req.params.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required." });
    }
    const keywords = query.split(" ");

    const searchConditions = keywords.map((keyword) => ({
      $or: [
        { eventTitle: { $regex: keyword, $options: "i" } },
        { eventDescription: { $regex: keyword, $options: "i" } },
        { eventType: { $regex: keyword, $options: "i" } },
        { eventLocation: { $regex: keyword, $options: "i" } },
        { state: { $regex: keyword, $options: "i" } },
      ],
    }));
    const results = await Event.find({ $and: searchConditions });

    res.status(200).json(results);
  } catch (error) {
    console.error("Error searching events:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const dashboard = async (req, res) => {
  try {
    const { hostId } = req.params;
    const events = await Event.find({ hostId }).select('eventTitle ticketPrice state eventDate eventLocation eventType totalSeats booked');
    if (!hostId) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }
    return res.status(200).json({
      success: true,
      events,
    })
  } catch (error) {
    console.error("Error in get events data:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

export const seatSelection = async (req, res) => {
  try {
    const { userId, selectedSeats } = req.body;
    const event = await Event.findById(req.params.eventId);

    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    // Check if any selected seats are already booked
    if (selectedSeats.some((seat) => event.bookedSeats.includes(seat))) {
      return res.status(400).json({ success: false, message: "Some seats are already booked!" });
    }

    // Add seats to booked list
    event.bookedSeats.push(...selectedSeats);
    event.booked.push({ userId, seats: selectedSeats });

    // Update total revenue
    event.totalRevenue += selectedSeats.length * event.ticketPrice;

    await event.save();
    res.json({ success: true, message: "Seats booked successfully!" });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
 

const generateReceiptPDF = (user, event, selectedSeats, paymentId) => {
  return new Promise((resolve, reject) => {
    const receiptsDir = "./receipts";
    if (!fs.existsSync(receiptsDir)) {
      fs.mkdirSync(receiptsDir, { recursive: true });
    }

    const filePath = `${receiptsDir}/ticket_${paymentId}.pdf`;
    const doc = new PDFDocument({ margin: 50 });

    const formattedDate = moment(event.eventDate).format("DD MMM YYYY, hh:mm ");

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    /** 1️⃣ **Receipt Section** **/
    doc
      .fillColor("#1D4ED8")
      .font("Helvetica-Bold")
      .fontSize(26)
      .text("Eventify", { align: "center" })
      .moveDown(0.5);

    doc
      .fillColor("#000000")
      .fontSize(16)
      .text("Official Payment Receipt", { align: "center" })
      .moveDown(1);

    // 📝 Receipt Details Table-like Alignment
    const details = [
      ["User Name", `${user.firstname} ${user.lastname}`],
      ["Email", user.email],
      ["Event", event.eventTitle],
      ["Date", `${formattedDate} ${event.startTimePeriod}`],
      ["Venue", event.eventLocation],
      ["Seats", selectedSeats.join(", ")],
      ["Total Amount", `${selectedSeats.length * event.ticketPrice} /-`],
      ["Payment ID", paymentId],
    ];

    let y = doc.y + 10;
    const labelX = 50; // Left column position
    const valueX = 200; // Right column position

    details.forEach(([label, value]) => {
      doc.font("Helvetica-Bold").text(label + ":", labelX, y);
      doc.font("Helvetica").text(value, valueX, y);
      y += 20;
    });

    doc.moveDown(2);
    doc
      .fontSize(14)
      .fillColor("#1D4ED8")
      .text("Thank you for booking with Eventify!", { align: "center" })
      .moveDown(0.5);

    doc
      .fontSize(12)
      .fillColor("#000000")
      .text("For any inquiries, contact us at support@eventify.com", { align: "center" });

    doc.addPage(); // 📄 New Page for Ticket

    /** 2️⃣ **Ticket Section - Better Alignment** **/
    doc.rect(50, 100, 500, 250).stroke(); // Ticket border

    // 🏷️ **Event Name - Large & Bold**
    doc
      .fontSize(24)
      .fillColor("#1D4ED8")
      .font("Helvetica-Bold")
      .text(event.eventTitle, 60, 120)
      .fillColor("#000000");

    // 👤 **User Name (Bold)**
    doc
      .font("Helvetica-Bold")
      .fontSize(18)
      .text(`${user.firstname} ${user.lastname}`, 60, 150);

    // 📅 **Event Details Table**
    let ticketY = 180;
    const ticketLabelX = 60;
    const ticketValueX = 180;

    const ticketDetails = [
      ["Date", `${formattedDate} ${event.startTimePeriod}`],
      ["Venue", event.eventLocation],
      ["Seats", selectedSeats.join(", ")],
      ["Payment ID", paymentId],
    ];

    ticketDetails.forEach(([label, value]) => {
      doc.font("Helvetica-Bold").text(label + ":", ticketLabelX, ticketY);
      doc.font("Helvetica").text(value, ticketValueX, ticketY);
      ticketY += 30;
    });

    // 🎟️ **QR Code for Ticket Verification**
    const qrCode = qr.imageSync(paymentId, { type: "png" });
    const qrFilePath = `${receiptsDir}/qr_${paymentId}.png`;
    fs.writeFileSync(qrFilePath, qrCode);

    doc.image(qrFilePath, 420, 180, { width: 100 });

    doc.end();

    writeStream.on("finish", () => {
      fs.unlinkSync(qrFilePath); // Clean up QR code file
      resolve(filePath);
    });
    writeStream.on("error", (error) => reject(error));
  });
};
// Function to send receipt via email
const sendReceiptToUser = async (email, filePath) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail email
      pass: process.env.EMAIL_PASS, // Your Gmail app password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Event Booking Receipt - Eventify",
    text: "Thank you for booking with Eventify! Please find your payment receipt attached.",
    attachments: [
      {
        filename: `receipt_${filePath.split("/").pop()}`,
        path: filePath,
      },
    ],
  };

  return transporter.sendMail(mailOptions);
};

export const initiateRazorpayPayment = async (req, res) => {
  try {
    const { eventId, userId, amount, selectedSeats } = req.body;

    if (!eventId || !userId || !amount || !selectedSeats.length) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Fetch event details
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: "Event not found." });

    // Check seat availability
    if (selectedSeats.some(seat => event.bookedSeats.includes(seat))) {
      return res.status(400).json({ success: false, message: "Some seats are already booked!" });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay takes amount in paise
      currency: "INR",
      receipt: `receipt_${userId}`,
      payment_capture: 1,
    });

    return res.status(200).json({
      success: true,
      message: "Razorpay order created successfully",
      order,
    });

  } catch (error) {
    console.error("Error initiating Razorpay payment:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const razorpayCallback = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, eventId, userId, selectedSeats } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      throw new Error("Invalid payment details.");
    }

    // Verify payment signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      throw new Error("Payment verification failed!");
    }

    const event = await Event.findById(eventId).populate("hostId").session(session);
    if (!event) throw new Error("Event not found.");

    if (selectedSeats.some(seat => event.bookedSeats.includes(seat))) {
      throw new Error("Some seats are already booked!");
    }

    // Update event details
    event.bookedSeats.push(...selectedSeats);
    event.booked.push({ userId, seats: selectedSeats });
    event.totalRevenue += selectedSeats.length * event.ticketPrice;
    await event.save({ session });

    // Update host revenue
    const host = event.hostId;
    host.allTimeRevenue += selectedSeats.length * event.ticketPrice;
    host.allTimeTicketSold += selectedSeats.length;
    await host.save({ session });

    // Update user's booked events
    const user = await User.findById(userId).session(session);
    if (!user) throw new Error("User not found.");
    user.bookedEvents.push(eventId);
    await user.save({ session });

    // Generate and send receipt
    const receiptPath = await generateReceiptPDF(user, event, selectedSeats, razorpay_payment_id);
    await sendReceiptToUser(user.email, receiptPath);

    await session.commitTransaction();
    return res.status(200).json({ success: true, message: "Payment successful, ticket booked!" });

  } catch (error) {
    console.error("Error processing Razorpay payment:", error);
    await session.abortTransaction();
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

export const cancelBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { eventId } = req.params;
    const { selectedSeats, userId } = req.body; 

    console.log("Cancel Request:", { userId, eventId, selectedSeats });

    if (!selectedSeats || selectedSeats.length === 0) {
      throw new Error("No seats selected for cancellation.");
    }

    const event = await Event.findById(eventId).session(session);
    if (!event) throw new Error("Event not found.");

    console.log("Event Booked Users:", event.booked);
    event.booked.forEach((entry, index) => {
      console.log(`Entry ${index}:`, entry);
      if (!entry.userId) {
        console.error(`❌ Missing userId in entry ${index}:`, entry);
      }
    });

    // ✅ FIX: Ensure `userId` exists before comparing
    if (!event.booked.some(entry => entry?.userId?.toString() === userId.toString())) {
      throw new Error("You haven't booked this event.");
    }

    // ✅ Remove only the selected seats for the user
    event.booked = event.booked.map(entry => {
      if (entry?.userId?.toString() === userId.toString()) {
        entry.seats = entry.seats.filter(seat => !selectedSeats.includes(seat));
      }
      return entry;
    }).filter(entry => entry.seats.length > 0); // Remove empty bookings

    event.bookedSeats = event.bookedSeats.filter(seat => !selectedSeats.includes(seat));
    event.totalRevenue -= selectedSeats.length * event.ticketPrice;

    await event.save({ session });

    const user = await User.findById(userId).session(session);
    if (!user) throw new Error("User not found.");

    // ✅ Remove event from user's bookings only if no seats left
    user.bookedEvents = user.bookedEvents.filter(event => event.toString() !== eventId);
    await user.save({ session });

    await session.commitTransaction();
    res.json({
      success: true,
      message: "Booking cancelled successfully.",
      updatedEvent: event,
    });

  } catch (error) {
    console.error("Error while cancelling booking:", error);
    await session.abortTransaction();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

