import mongoose from "mongoose";

const detailSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
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
}, { timestamps: true });

export const Detail = mongoose.model("Detail", detailSchema);