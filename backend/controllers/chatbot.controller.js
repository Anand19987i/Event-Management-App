import { Event } from "../models/event.model.js";

export const chatBot = async (req, res) => {
  const { message } = req.body;

  try {
    // Greeting response
    if (/hi|hello/i.test(message)) {
      return res.json({
        reply: `How can I help you?`
      });
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

    // Query for specific dates or date ranges
    if (/on (\d{1,2}\/\d{1,2}\/\d{4})/i.test(message)) {
      const date = message.match(/on (\d{1,2}\/\d{1,2}\/\d{4})/i)[1];
      const events = await Event.find({
        eventDate: { $gte: new Date(date) }
      });
      const eventList = events.map(event =>
        `• ${event.eventTitle}\n  Date: ${event.eventDate}\n  Venue: ${event.eventLocation}`
      ).join('\n\n');
      return res.json({
        reply: `Here are the events on ${date}:\n\n${eventList}`
      });
    }

    // Query for events by category (e.g., Music, Workshops, Conferences)
    if (/music|workshop|conference/i.test(message)) {
      const category = message.match(/music|workshop|conference/i)[0].toLowerCase();
      const events = await Event.find({ category });
      const eventList = events.map(event =>
        `• ${event.eventTitle}\n  Date: ${event.eventDate}\n  Venue: ${event.eventLocation}`
      ).join('\n\n');
      return res.json({
        reply: `Here are the ${category} events:\n\n${eventList}`
      });
    }

    // Query for event registration or ticket info
    if (/register|ticket/i.test(message)) {
      const eventName = message.split('for')[1]?.trim();
      const event = await Event.findOne({
        eventTitle: new RegExp(eventName, 'i'),
      });

      if (event) {
        return res.json({
          reply: `You can register for ${event.eventTitle} at the following link: ${`http://localhost:5173/details/${event.eventTitle}/${event._id}}`}`
        });
      } else {
        return res.json({
          reply: `Sorry, I couldn't find any event named "${eventName}".`
        });
      }
    }

    // General query for event details (without being specific)
    if (/tell me about|what are|give me/i.test(message)) {
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

    // Query for event venue information
    if (/where is/i.test(message)) {
      const eventName = message.split('is')[1]?.trim();
      const event = await Event.findOne({
        eventTitle: new RegExp(eventName, 'i'),
      });

      if (event) {
        return res.json({
          reply: `The event "${event.eventTitle}" will be held at ${event.eventLocation} on ${event.eventDate}.`
        });
      } else {
        return res.json({
          reply: `Sorry, I couldn't find any event named "${eventName}".`
        });
      }
    }

    // Help query
    if (/help|how to/i.test(message)) {
      return res.json({
        reply: `You can search for upcoming events, get event details, register for events, and much more. Try typing "upcoming events" or "details about [event name]".`
      });
    }

    // Goodbye response
    if (/goodbye|bye|see you later/i.test(message)) {
      return res.json({
        reply: `Goodbye! Feel free to reach out whenever you need help with events. Have a great day!`
      });
    }

    // Default response for unrecognized queries
    res.json({
      reply: "I'm sorry, I didn't understand that. Can you rephrase? You can try asking about upcoming events, event details, or venue information."
    });
  } catch (error) {
    console.error('Error processing chatbot message:', error);
    res.status(500).json({
      reply: 'Something went wrong. Please try again later.',
    });
  }
};
