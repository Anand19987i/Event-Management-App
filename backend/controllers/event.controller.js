import cloudinary from '../config/cloudinary.js';
import getDataUri from '../config/datauri.js';
import { Event } from '../models/event.model.js';
import mongoose from 'mongoose';
import OpenAI from "openai";
import axios from "axios";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai"
import { User } from '../models/user.model.js';
import * as tf from '@tensorflow/tfjs';  // Use tfjs-node for Node.js environment
import { UserEventInteraction } from '../models/recommendation.model.js';
dotenv.config();

export const createEvent = async (req, res) => {
  try {
    const { eventTitle, eventType, eventArtist, eventDescription, eventLocation, ticketPrice, state, eventDate, startTime, startTimePeriod, endTime, endTimePeriod, totalSeats } = req.body;
    const { hostId } = req.params;
    const { eventThumbnail, eventPoster } = req.files;
    const eventThumbnailUri = getDataUri(eventThumbnail[0]);
    const cloudThumbnailResponse = await cloudinary.uploader.upload(eventThumbnailUri);
    const eventPosterUri = getDataUri(eventPoster[0]);
    const cloudPosterResponse = await cloudinary.uploader.upload(eventPosterUri);
    const newEvent = await Event.create({
      hostId: hostId,
      eventThumbnail: cloudThumbnailResponse.secure_url,
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
      .select('eventTitle eventThumbnail ticketPrice eventArtist eventType eventLocation').sort({ createdAt: -1 });

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

    const eventDetail = await Event.findById(eventId).select("eventTitle eventDescription eventArtist eventThumbnail ticketPrice eventPoster state eventDate eventLocation eventType startTime endTime startTimePeriod endTimePeriod totalSeats");

    if (!eventDetail) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    return res.status(200).json({ success: true, eventDetail });
  } catch (error) {
    console.error('Error fetching event details:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getUserEvents = async (req, res) => {
  try {
    const { id } = req.params;
    const hostId = id;
    const userEvents = await Event.find({ hostId }).select("eventTitle eventThumbnail ticketPrice eventArtist eventType eventLocation").sort({ createdAt: -1 });
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
    let { eventThumbnail, eventPoster } = req.files;

    // Check if eventThumbnail and eventPoster are provided
    let cloudThumbnailResponse = null;
    let cloudPosterResponse = null;

    if (eventThumbnail && eventThumbnail.length > 0) {
      const eventThumbnailUri = getDataUri(eventThumbnail[0]);
      cloudThumbnailResponse = await cloudinary.uploader.upload(eventThumbnailUri);
    }

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
        eventThumbnail: cloudThumbnailResponse ? cloudThumbnailResponse.secure_url : existingEvent.eventThumbnail,
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
    const { userId } = req.body; // userId should be a string.
    const { eventId } = req.params;

    // Fetch the event by ID
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // Check if the event is fully booked
    if (event.booked.length >= event.maxCapacity) {
      return res.status(400).json({ message: "Event is fully booked." });
    }

    // Check if the user has already booked this event
    if (event.booked.includes(userId)) {
      return res.status(400).json({ message: "You have already booked this event." });
    }

    // Add the userId to the event's booked array
    event.booked.push(userId);
    await event.save();

    // Fetch the user and add the eventId to their bookedEvents array
    const user = await User.findById(userId); // Fetch user using userId directly.
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.bookedEvents.push(eventId);
    await user.save();

    return res.status(200).json({ success: true, message: "Event booked successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while booking the event." });
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
      select: "eventTitle eventThumbnail ticketPrice eventArtist eventType eventLocation",
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



