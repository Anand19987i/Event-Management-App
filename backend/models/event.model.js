import mongoose from "mongoose";

const eventSchema = mongoose.Schema(
  {
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Host",
      required: true,
    },
    eventPoster: {
      type: String,
      required: true,
    },
    eventTitle: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    eventArtist: {
      type: String,
      required: true,
    },
    eventDescription: {
      type: String,
      required: true,
    },
    ticketPrice: {
      type: Number, // Changed from String to Number
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    eventLocation: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    startTimePeriod: {
      type: String,
      required: true,
    },
    endTimePeriod: {
      type: String,
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    bookedSeats: {
      type: [Number], // Stores seat numbers instead of user IDs
      default: [],
    },
    booked: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Store user who booked
        seats: [Number], 
      },
    ],
    totalRevenue: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
