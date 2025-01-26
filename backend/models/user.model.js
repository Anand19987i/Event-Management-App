import mongoose from "mongoose"
import jwt from 'jsonwebtoken';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: true,
    },
    bookedEvents: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }
    ],
    isFirstTime: {
        type: Boolean,
        default: true,
    }

}, {timestamps: true});

userSchema.methods.setAuthToken = function () {
    const token = jwt.sign({_id: this.id}, process.env.JWT_SECRET, {expiresIn: '24h'});
    return token;
}

export const User = mongoose.model("User", userSchema);