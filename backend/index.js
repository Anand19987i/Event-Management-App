import cookieParser from "cookie-parser";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoute from "./routes/user.route.js";
import hostRoute from "./routes/host.route.js";
import eventRoute from "./routes/event.route.js";
import chatBotRoute from "./routes/chatbot.route.js";

dotenv.config({});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOption = {
    origin: "https://eventify-7ojp.onrender.com",
    //origin: "http://localhost:5173",
    credentials: true,
}

app.use(cors(corsOption));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/host", hostRoute);
app.use("/api/v1/event", eventRoute);
app.use("/api/v1/chatbot", chatBotRoute);

const port = process.env.PORT || 4000;

const server = createServer(app);

server.listen(port, () => {
    connectDB();
    console.log(`Server is listening on port ${port}`);
})