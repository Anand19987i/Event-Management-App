import { USER_API_END_POINT } from "../utils/constant";
import { setLoading } from "../redux/authSlice";
import { EyeIcon, EyeOff, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
    const [type, setType] = useState("password");
    const [icon, setIcon] = useState(EyeOff);
    const [confirmType, setConfirmType] = useState("password");
    const [eyeIcon, setEyeIcon] = useState(EyeOff);
    const [input, setInput] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errorMessage, setErrorMessage] = useState("");

    const { loading } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            dispatch(setLoading(true));

            // Make POST request with JSON data
            const response = await axios.post(
                `${USER_API_END_POINT}/signup`,
                {
                    name: input.name,
                    email: input.email,
                    password: input.password,
                    confirmPassword: input.confirmPassword,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            if (response.data.success) {
                dispatch(setLoading(false));
                navigate("/login");
            }
        } catch (error) {
            if (error.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("Something went wrong. Please try again.");
            }
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handlePasswordIcon = () => {
        setIcon(type === "password" ? EyeIcon : EyeOff);
        setType(type === "password" ? "text" : "password");
    };

    const handlePasswordIcon2 = () => {
        setEyeIcon(confirmType === "password" ? EyeIcon : EyeOff);
        setConfirmType(confirmType === "password" ? "text" : "password");
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
            style={{
                backgroundImage:
                    "url('https://source.unsplash.com/random/1920x1080?event')",
            }}
        >
            <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-xl max-w-md w-full">
                <form onSubmit={submitHandler} className="w-full">
                    <h1 className="text-2xl font-bold mb-4">
                        Register to <span className="text-purple-600">Eventify</span>
                    </h1>
                    <p className="mb-6 text-sm font-medium">
                        Already have an account?{" "}
                        <Link to="/login" className="text-purple-600 underline">
                            Sign in
                        </Link>
                    </p>
                    <div className="flex flex-col mb-4">
                        <label className="mb-2 text-gray-700">
                            Name <span className="text-red-600">*</span>
                        </label>
                        <input
                            name="name"
                            value={input.name}
                            onChange={changeHandler}
                            type="text"
                            placeholder="Enter your name"
                            required
                            className="border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-600"
                        />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label className="mb-2 text-gray-700">
                            Email <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={input.email}
                            onChange={changeHandler}
                            placeholder="Enter a valid email"
                            required
                            className="border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-600"
                        />
                    </div>
                    <div className="flex flex-col mb-4 relative">
                        <label className="mb-2 text-gray-700">
                            Password <span className="text-red-600">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={type}
                                name="password"
                                value={input.password}
                                onChange={changeHandler}
                                placeholder="Enter a password"
                                required
                                className="border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-600 w-full"
                            />
                            <span
                                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                                onClick={handlePasswordIcon}
                            >
                                {React.createElement(icon, { size: 20 })}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col mb-4 relative">
                        <label className="mb-2 text-gray-700">
                            Confirm Password <span className="text-red-600">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={confirmType}
                                name="confirmPassword"
                                value={input.confirmPassword}
                                onChange={changeHandler}
                                placeholder="Confirm your password"
                                required
                                className="border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-600 w-full"
                            />
                            <span
                                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                                onClick={handlePasswordIcon2}
                            >
                                {React.createElement(eyeIcon, { size: 20 })}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-start mb-6">
                        <input
                            type="checkbox"
                            id="terms"
                            required
                            className="w-5 h-5 text-purple-600 focus:ring-purple-600 rounded border-gray-300"
                        />
                        <label htmlFor="terms" className="ml-3 text-gray-700">
                            I agree to the terms and conditions
                        </label>
                    </div>
                    {errorMessage && (
                        <p className="text-red-500 text-center font-medium mb-3">
                            {errorMessage}
                        </p>
                    )}
                    {loading ? (
                        <button
                            type="submit"
                            className="bg-purple-800 text-white py-3 px-6 rounded-2xl mx-auto my-5 flex items-center justify-center w-full"
                        >
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please Wait
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="flex bg-purple-800 text-white px-6 py-3 rounded-2xl mx-auto my-5 justify-center w-full"
                        >
                            Sign Up
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Signup;
