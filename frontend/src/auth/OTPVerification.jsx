import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
    const inputRefs = useRef([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Retrieve email from location state (if redirected from Forgot Password)
    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        }
    }, [location]);

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = otp.split('');
        newOtp[index] = value;
        const joinedOtp = newOtp.join('');
        setOtp(joinedOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const sendOtp = async () => {
        setSendLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
        try {
            const response = await axios.post(`${USER_API_END_POINT}/send-otp`, { email }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });
            setToken(response.data.token);
            setSuccessMessage('OTP sent to your email!');
            setSuccess(true);
        } catch (error) {
            setErrorMessage('Email is not registered');
        } finally {
            setSendLoading(false);
        }
    };

    const verifyOtp = async () => {
        if (otp.length !== 6) {
            setErrorMessage('Please enter a 6-digit OTP');
            return;
        }
        setVerifyLoading(true);
        setErrorMessage('');
        try {
            const response = await axios.post(`${USER_API_END_POINT}/verify-otp`, { otp, token, email });
            dispatch(setUser(response.data.user));
            navigate("/forgot-password", { state: { email } }); // Redirect to Reset Password with email
        } catch (error) {
            setErrorMessage('Invalid OTP');
        } finally {
            setVerifyLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        OTP Verification
                    </h1>
                    <p className="text-gray-600">
                        {success ? `Enter the OTP sent to ${email}` : 'Enter your email to receive the OTP'}
                    </p>
                </div>

                {errorMessage && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">{errorMessage}</div>}
                {successMessage && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg">{successMessage}</div>}

                {!success ? (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                placeholder="example@email.com"
                            />
                        </div>
                        <button
                            onClick={sendOtp}
                            disabled={sendLoading || !email}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {sendLoading ? (
                                <Loader2 className="animate-spin mx-auto h-6 w-6" />
                            ) : 'Send OTP'}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex gap-2 justify-center mb-8">
                            {[...Array(6)].map((_, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    value={otp[index] || ''}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    className="w-12 h-16 border-2 border-gray-200 rounded-xl text-center text-2xl font-semibold focus:border-purple-600 focus:outline-none"
                                />
                            ))}
                        </div>
                        <button
                            onClick={verifyOtp}
                            disabled={verifyLoading || otp.length !== 6}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {verifyLoading ? (
                                <Loader2 className="animate-spin mx-auto h-6 w-6" />
                            ) : 'Verify OTP'}
                        </button>
                    </div>
                )}

                <p className="text-center mt-6 text-sm text-gray-600">
                    Remember your password?{' '}
                    <Link to="/login" className="text-purple-600 hover:underline font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default OTPVerification;
