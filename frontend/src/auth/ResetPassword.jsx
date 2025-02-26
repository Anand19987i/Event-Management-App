import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { CheckCircle, Lock, Loader2 } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  // If email is missing, redirect back to Forgot Password
  if (!email) {
    navigate("/forgot-password");
  }

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long!");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${USER_API_END_POINT}/reset-password`,
        { email, password, confirmPassword }
      );

      if (response.data.success) {
        setSuccess(true);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        {success ? (
          <div className="text-center">
            <CheckCircle className="text-green-500 mx-auto h-16 w-16 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">
              Password Reset Successful!
            </h2>
            <p className="text-gray-600 mt-2">You can now log in with your new password.</p>
            <button
              onClick={() => navigate("/login")}
              className="mt-6 w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <Lock className="text-purple-600 mx-auto h-16 w-16 mb-3" />
              <h2 className="text-2xl font-bold text-gray-800">
                Reset Password
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Enter your new password below.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleReset} className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="relative">
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-500 transition flex items-center justify-center disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
