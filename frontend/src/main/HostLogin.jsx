import React, { useState } from "react";
import { EyeIcon, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { HOST_API_END_POINT } from "../utils/constant";
import { setHost, setLoading, setToken, setUser } from "../redux/authSlice";

const HostLogin = () => {
  const [icon, setIcon] = useState(EyeOff);
  const [type, setType] = useState("password");
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const { loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const handleShowPassword = () => {
    setType(type === "password" ? "text" : "password");
    setIcon(type === "password" ? EyeIcon : EyeOff);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const response = await axios.post(`${HOST_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (response.data.success) {
        dispatch(setHost(response.data.user));
        dispatch(setToken(response.data.token));
        navigate("/host/main");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-800"
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-xl max-w-md w-full">
        <form onSubmit={submitHandler} className="w-full">
          <h1 className="text-3xl font-bold text-start mb-4 text-gray-800">
            Welcome to <span className="text-purple-600">Eventify</span> as a Host!
          </h1>
          <p className="text-sm font-medium mb-6 text-gray-600">
            Don't have a host account? {" "}
            <span className="underline cursor-pointer text-purple-600">
              <Link to="/signup-as-host">Sign up</Link>
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
          {errorMessage && (
            <p className="text-red-600 p-4 text-center">{errorMessage}</p>
          )}
          {loading ? (
            <button
              type="submit"
              className="bg-purple-800 text-white py-3 px-6 rounded-2xl mx-auto my-5 flex items-center justify-center w-full"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging In...
            </button>
          ) : (
            <button
              type="submit"
              className="flex bg-purple-800 text-white px-6 py-3 rounded-2xl mx-auto my-5 justify-center w-full"
            >
              Log In
            </button>
          )}
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">Or</p>
        <Link
          to="/login"
          className="w-full py-3 mt-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-400 text-center block"
        >
          Login as User
        </Link>
      </div>
    </div>
  );
};

export default HostLogin;
