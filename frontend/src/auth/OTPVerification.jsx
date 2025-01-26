import React, { useState } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setUser } from '@/redux/authSlice';

const OTPVerification = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [token, setToken] = useState('');
    const [success, setSuccess] = useState(false);
    const [sendLoading, setSendLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { user } = useSelector(store => store.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const sendOtp = async () => {
        setSendLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
        try {
            const response = await axios.post(`${USER_API_END_POINT}/send-otp`, { email }, {
                header: {
                    'Content-Type': 'application/json',
                }, withCredentials: true,
            });
            setToken(response.data.token);
            setSuccessMessage('Please check your email inbox!!');
            setSuccess(true);
        } catch (error) {
            console.log(error)
            setErrorMessage('Email is not registered');
        } finally {
            setSendLoading(false);
        }
    };

    const verifyOtp = async () => {
        setVerifyLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
        try {
            const response = await axios.post(`${USER_API_END_POINT}/verify-otp`, { otp, token, email });
            if (response.data.success) {
                dispatch(setUser(response.data.user));
                navigate("/");
            }
            setSuccessMessage(response.data.message);
        } catch (error) {
            setErrorMessage('Invalid OTP');
        } finally {
            setVerifyLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('https://source.unsplash.com/random/1920x1080?otp-verification')" }}
        >
            <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-xl max-w-md w-full">
                <h1 className="text-2xl font-bold mb-4">
                    Sign in to <span className="text-purple-600">Eventify</span>
                </h1>
                <p className="text-sm font-medium mb-2">
                    Don't have an account?{" "}
                    <span className="underline cursor-pointer text-purple-600">
                        <Link to="/signup">Sign up</Link>
                    </span>
                </p>
                {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
                {successMessage && <p className="text-black font-semibold mb-4">{successMessage}</p>}

                <div className="flex flex-col mb-4">
                    <label className="mb-2 text-gray-700">
                        Email <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        name='email'
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-600"
                    />
                </div>

                <button
                    onClick={sendOtp}
                    className="bg-purple-800 text-white py-3 px-6 rounded-2xl mx-auto my-5 w-full flex items-center justify-center"
                    disabled={sendLoading}
                >
                    {sendLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        'Send OTP'
                    )}
                </button>

                <div className={`${success? 'flex flex-col mb-4' : 'hidden'}`}>
                    <label className="mb-2 text-gray-700">
                        OTP <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        className="border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-600"
                    />
                </div>

                <button
                    onClick={verifyOtp}
                    className={`${success ? 'bg-purple-800 text-white py-3 px-6 rounded-2xl mx-auto my-5 w-full flex items-center justify-center' : 'hidden'}`}
                    disabled={verifyLoading}
                >
                    {verifyLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                        </>
                    ) : (
                        'Verify OTP'
                    )}
                </button>
            </div>
        </div>
    );
};

export default OTPVerification;
