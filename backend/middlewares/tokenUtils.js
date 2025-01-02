import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];
    if (!token)
        return res.status(401).json({ message: "Unauthorized user" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        req.user = user;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized token'});
    }

}