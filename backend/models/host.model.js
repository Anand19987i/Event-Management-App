import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const hostSchema = mongoose.Schema({
    avatar: {
        type: String,
    },
    mobile: {
        type: Number,
        default: "",
    },
    firstname: {
        type: String,
        default: "",
    },
    lastname: {
        type: String,
        default: "",
    },
    address: {
        type: String,
        default: "",
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: true,
    },
    hostedEvents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
        }
    ]
}, { timestamps: true});

hostSchema.methods.setAuthToken = function () {
    const token = jwt.sign({_id: this.id}, process.env.JWT_SECRET, {expiresIn: '24h'});
}

export const Host = mongoose.model('Host', hostSchema);

