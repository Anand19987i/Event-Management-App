import cloudinary from "../config/cloudinary.js";
import getDataUri from "../config/datauri.js";
import { Detail } from "../models/detail.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

export const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Password does not match",
                success: true,
            });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
                success: false,
            });
        }
        const newUser = await User.create({
            name,
            email,
            password,
            confirmPassword,
        })
        const token = newUser.setAuthToken();

        return res.status(201).json({
            success: true,
            token,
            newUser
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server error",
            success: false,
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(500).json({
                message: "User doesn't exists",
                success: false,
            });
        }
        if (password === user.password) {
            const token = user.setAuthToken();
            return res.status(200).json({ success: true,  token, user });
        } else {
            return res.status(401).json({
                message: "Please check your credentials",
                success: false,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server error",
            success: false,
        })
    }
}

export const userDetail = async (req, res) => {
    try {
        const { id } = req.params; // Extract user ID from route params
        const { mobile, firstname, lastname, address } = req.body;
        const file = req.file;

        let avatarUrl = null;

        if (file) {
            // Convert the uploaded file to a Cloudinary-compatible URI
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri);
            avatarUrl = cloudResponse.secure_url;
        }

        // Check for existing details of the user with the provided userId
        let details = await Detail.findOne({ userId: id });

        if (details) {
            // Update existing user details
            details.mobile = mobile || details.mobile;
            details.firstname = firstname || details.firstname;
            details.lastname = lastname || details.lastname;
            details.address = address || details.address;
            if (avatarUrl) {
                details.avatar = avatarUrl; // Update avatar only if a new one is provided
            }
            await details.save();
        } else {
            // Create a new record for the user if no details exist
            details = await Detail.create({
                userId: id,
                avatar: avatarUrl || "default-avatar-url.png",
                mobile,
                firstname,
                lastname,
                address,
            });
        }

        return res.status(200).json({
            message: "User details updated successfully",
            success: true,
            userDetail: details,
        });
    } catch (error) {
        console.error("Error processing user details:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

export const fetchUserDetail = async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
  
    try {
      const userDetail = await Detail.findOne({ userId: id });
      if (!userDetail) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ success: true, userDetail });
    } catch (error) {
      console.error("Error fetching user details:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
export const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            token,
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error.",
            success: false
        });
    }
};
