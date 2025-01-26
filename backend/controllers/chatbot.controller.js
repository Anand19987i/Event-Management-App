import { Event } from "../models/event.model.js";

export const chatBot = async (req, res) => {
  const { message } = req.body;

  try {

    if (/hi|hello/i.test(message)) {
      return res.json({
        reply: `How can I help you ?`
      })
    }
    // Check for queries about upcoming events
    if (/events|upcoming/i.test(message)) {
      const events = await Event.find({});
      const eventList = events
        .map((event) => 
          `• ${event.eventTitle}\n  Date: ${event.eventDate}\n  Venue: ${event.eventLocation}`
        )
        .join('\n\n');
      return res.json({
        reply: `Here are the upcoming events:\n\n${eventList}`,
      });
    }

    // Check for queries requesting specific event details
    if (/details|info about/i.test(message)) {
      const eventName = message.split('about')[1]?.trim();
      const event = await Event.findOne({
        eventTitle: new RegExp(eventName, 'i'),
      });

      if (event) {
        return res.json({
          reply: `Details for the event:\n\n• ${event.eventTitle}\n  Date: ${event.eventDate}\n  Venue: ${event.eventLocation}`,
        });
      } else {
        return res.json({
          reply: `Sorry, I couldn't find any event named "${eventName}".`,
        });
      }
    }

    // Default response for unrecognized queries
    res.json({
      reply: "I'm sorry, I didn't understand that. Can you rephrase?",
    });
  } catch (error) {
    console.error('Error processing chatbot message:', error);
    res.status(500).json({
      reply: 'Something went wrong. Please try again later.',
    });
  }
};
