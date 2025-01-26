import { HOST_API_END_POINT, USER_API_END_POINT } from "../utils/constant";
import { setLoading } from "../redux/authSlice";
import { EyeIcon, EyeOff, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const HostSignup = () => {
    const [type, setType] = useState("password");
    const [icon, setIcon] = useState(EyeOff);
    const [confirmType, setConfirmType] = useState("password");
    const [eyeIcon, setEyeIcon] = useState(EyeOff);
    const [input, setInput] = useState({
        name: "",
        email: "",
        role: "user",
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

            const response = await axios.post(
                `${HOST_API_END_POINT}/signup`,
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
                navigate("/login-as-host");
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 px-4 py-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full">
                <form onSubmit={submitHandler} className="space-y-6">
                    <h1 className="text-3xl font-bold text-gray-800 text-center">
                        Sign Up to <span className="text-purple-600">Eventify</span> as a Host!
                    </h1>
                    <p className="text-sm ml-5 text-gray-500">
                        Already have an account?{" "}
                        <Link to="/login-as-host" className="text-purple-600 underline">
                            Sign in
                        </Link>
                    </p>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name <span className="text-red-600">*</span>
                        </label>
                        <input
                            name="name"
                            value={input.name}
                            onChange={changeHandler}
                            type="text"
                            placeholder="Enter your name"
                            required
                            className="w-full bg-gray-200 border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={input.email}
                            onChange={changeHandler}
                            placeholder="Enter a valid email"
                            required
                            className="w-full bg-gray-200 border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-600"
                        />
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password <span className="text-red-600">*</span>
                        </label>
                        <input
                            type={type}
                            name="password"
                            value={input.password}
                            onChange={changeHandler}
                            placeholder="Enter a password"
                            required
                            className="w-full bg-gray-200 border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-600"
                        />
                        <span
                            className="absolute top-11 right-3 cursor-pointer text-gray-500"
                            onClick={handlePasswordIcon}
                        >
                            {React.createElement(icon, { size: 20 })}
                        </span>
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password <span className="text-red-600">*</span>
                        </label>
                        <input
                            type={confirmType}
                            name="confirmPassword"
                            value={input.confirmPassword}
                            onChange={changeHandler}
                            placeholder="Confirm your password"
                            required
                            className="w-full bg-gray-200  border-gray-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-600"
                        />
                        <span
                            className="absolute top-11 right-3 cursor-pointer text-gray-500"
                            onClick={handlePasswordIcon2}
                        >
                            {React.createElement(eyeIcon, { size: 20 })}
                        </span>
                    </div>

                    {errorMessage && (
                        <p className="text-red-500 text-center font-medium">{errorMessage}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-purple-800 text-white font-semibold rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-600 disabled:bg-purple-500 flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                Please Wait
                            </>
                        ) : (
                            "Sign Up"
                        )}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-4">Or</p>
                <Link
                    to="/signup"
                    className="w-full py-3 mt-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-400 text-center block"
                >
                    Sign Up as User
                </Link>
            </div>
        </div>
    );
};

export default HostSignup;
