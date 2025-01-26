import mongoose from "mongoose";
import { User } from "./user.model.js";
import { Event } from "./event.model.js";

const userEventInteractionSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    eventIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    }],
    selectedTypes: {
        type: [String],
        required: true,
    },
}, { timestamps: true });

export const UserEventInteraction = mongoose.model('UserEventInteraction', userEventInteractionSchema);
