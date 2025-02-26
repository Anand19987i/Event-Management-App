import cloudinary from "../config/cloudinary.js";
import getDataUri from "../config/datauri.js";
import { Detail } from "../models/detail.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";

export const register = async (req, res) => {
    try {
        const { name, email, role, password, confirmPassword } = req.body;
        
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Password does not match",
                success: false,
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
            role,
            password,
            confirmPassword,
            isFirstTime: true,
        });

        // Set token in HTTP-only cookie
        const token = newUser.setAuthToken();
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(201).json({
            success: true,
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                isFirstTime: newUser.isFirstTime
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server error",
            success: false,
        });
    }
};

export const markAsNotFirstTime = async (req, res) => {
    try {
        // Access user ID from authenticated request
        const userId = req.user._id;
        console.log(userId);
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { isFirstTime: false },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: 'User marked not as first time',
            user: {
                _id: updatedUser._id,
                isFirstTime: updatedUser.isFirstTime
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Error updating user',
            error: error.message 
        });
    }
};
export const resetPassword = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        // Validate password confirmation
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match",
                success: false,
            });
        }

        // Update password and mark it modified
        user.password = password;
        user.confirmPassword = confirmPassword;
        user.markModified("password");
        user.markModified("confirmPassword"); // Ensure Mongoose updates the field
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password has been reset successfully!",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials",
                success: false,
            });
        }

        if (password !== user.password) {
            return res.status(401).json({
                message: "Invalid credentials",
                success: false,
            });
        }

        // Set token in HTTP-only cookie
        const token = user.setAuthToken();
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ 
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isFirstTime: user.isFirstTime
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server error",
            success: false,
        });
    }
};

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
        let details = await User.findOne({ _id: id });

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
            details = await User.create({
                _id: id,
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
        const userDetail = await User.findOne({ _id: id });
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
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
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

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendOtp = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ success: false, message: 'Email is not registered' })
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const token = jwt.sign({ otp }, process.env.JWT_SECRET, { expiresIn: '10m' });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Eventify: Your Sign-In Verification Code for Secure Access`,
        text: `
            Dear User,
    
            Thank you for choosing Eventify! We are excited to have you on board. 
    
            As part of our commitment to providing a secure platform, we have generated a one-time password (OTP) to verify your identity and ensure only you can access your account.
    
            Your OTP is: **${otp}**
    
            Please note:
            - This OTP is valid for the next 10 minutes only.
            - Do not share this OTP with anyone, as it is unique to your account.
            - If you did not request this verification, please disregard this email.
    
            To proceed with logging into your account, simply enter this OTP on the Eventify platform.
    
            If you have any issues or need assistance, please feel free to reach out to our support team at support@eventify.com.
    
            Best regards,
            The Eventify Team
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'OTP sent successfully', token });


    } catch (error) {
        console.log("Error in sending otp  :  ", error)
        res.status(500).json({ message: 'Error sending OTP', error });
    }
}

export const verifyOtp = async (req, res) => {
    const { otp, token, email } = req.body;
    try {
        const user = await User.findOne({ email });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.otp === otp) {
            res.status(201).json({ success: true, message: 'OTP verified successfully', user });
        } else {
            res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token', error });
    }
}
