import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { EyeIcon, EyeOff, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setLoading, setToken, setUser } from "../redux/authSlice";


const Login = () => {
    const [icon, setIcon] = useState(EyeOff);
    const [type, setType] = useState("password");
    const [input, setInput] = useState({
        email: "",
        password: "",
    })
    const [errorMessage, setErrorMessage] = useState("");

    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };
    
    const handleShowPassword = () => {
        if (type === "password") {
            setIcon(EyeIcon);
            setType("text");
        } else {
            setIcon(EyeOff);
            setType("password");
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const response = await axios.post(`${USER_API_END_POINT}/login`, input, {
                header: {
                    'Content-Type': 'application/json',
                }, withCredentials: true,
            })
            if (response.data.success) {
                dispatch(setLoading(false));
                dispatch(setUser(response.data.user));
                console.log(response.data.token);
                dispatch(setToken(response.data.token));
                navigate('/');
            }
        } catch (error) {
            console.log(error);
            dispatch(setLoading(false));
            if (error.response.data.message) {
                setErrorMessage(error.response.data.message);
            }
        }
        finally{
            dispatch(setLoading(false));
        }

    }

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('https://source.unsplash.com/random/1920x1080?login')" }}
        >
            <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-xl max-w-md w-full">
                <form onSubmit={submitHandler} className="w-full">
                    <h1 className="text-2xl font-bold text-start mb-4">
                        Welcome Back to <span className="text-purple-600">Eventify</span>
                    </h1>
                    <p className="text-sm font-medium mb-6">
                        Don't have an account?{" "}
                        <span className="underline cursor-pointer text-purple-600">
                            <Link to="/signup">Sign up</Link>
                        </span>
                    </p>
                    <div className="flex flex-col mb-4">
                        <label className="mb-2 text-gray-700">
                            Email <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={input.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
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
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                                className="border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-600 w-full"
                            />
                            <span
                                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                                onClick={handleShowPassword}
                            >
                                {React.createElement(icon, { size: 20 })}
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                       
                        <a href="#" className="text-purple-600 hover:underline">
                            Forgot Password?
                        </a>
                    </div>
                    <div>
                        {errorMessage && <p className="text-red-600 p-4 text-center">{errorMessage}</p>}
                    </div>
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
                            className="flex bg-purple-800 text-white px-6 py-3 rounded-2xl mx-auto my-5 justify-center w-full "
                        >
                            Log In
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Login;
