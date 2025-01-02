import { FaArrowUp, FaInbox, FaCopy } from "react-icons/fa6";
import { Loader2 } from "lucide-react";
import { BiDetail } from "react-icons/bi";
import Navbar from "../components/Navbar";
import { EVENT_API_END_POINT } from "../utils/constant";
import axios from "axios";
import React, { useState } from "react";
import MenuBar from "./MenuBar";

const AIChat = () => {
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) {
      setError("Please enter a prompt.");
      return;
    }

    setError("");
    setLoading(true);
    setResponse("");

    try {
      const apiResponse = await axios.post(
        `${EVENT_API_END_POINT}/ai/generate`,
        { query: userInput },
        { headers: { "Content-Type": "application/json" } }
      );

      const AIResponse = apiResponse.data.response;
      setResponse(AIResponse);
    } catch (error) {
      setError("An error occurred while communicating with AI.");
      console.error("AI Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Navbar />
      <MenuBar/>
      <div className="font-montserrat flex flex-col min-h-screen">
        {/* Main Content Section */}
        <div className="flex-grow p-4 overflow-auto">
          {error && <div className="text-red-500 mb-4">{error}</div>}

          <div className="w-full max-w-3xl mx-auto bg-white rounded-lg p-4 overflow-y-auto h-96 relative">
            {loading ? (
              <div className='loader'><div className="flex h-32 gap-4 p-5 fade-in-25 md:gap-6">
              <div className="flex w-full max-w-3xl flex-col gap-4 rounded-lg pt-2">
                <div
                  className="h-5 w-10/12 origin-left animate-loading bg-[length:200%] rounded-sm bg-gradient-to-r from-purple-50 from-30% via-purple-600/60 to-blue-50 bg-2x opacity-0"
                ></div>
                <div
                  className="h-5 w-full origin-left animate-loading bg-[length:200%] rounded-sm bg-gradient-to-r from-purple-500/60 via-slate-100 via-30% to-purple-500/60 to-60% bg-2x opacity-0 "
                ></div>
                <div
                  className="duration-600 h-5 w-3/5 origin-left animate-loading bg-[length:200%] rounded-sm bg-gradient-to-r from-purple-50 from-40%  via-purple-500/60 to-purple-50 to-70% bg-2x opacity-0 "
                ></div>
              </div>
            </div></div>
            ) : response ? (
              <div className="text-gray-800 space-y-4">
                <div>{response}</div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 text-sm text-purple-600 bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
                >
                  <FaCopy />
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center text-gray-700 font-poppins h-full gap-10">
               <h1 className="text-4xl font-bold">What Can I help With?</h1>
              </div>
            )}
          </div>
        </div>

        {/* Input Section */}
        <div className={`w-full p-4 absolute  ${response ? 'bottom-16' : 'bottom-64'} left-0`}>
          <form onSubmit={handleSubmit} className="flex gap-2 items-center max-w-3xl mx-auto bg-gray-300 p-2 rounded-lg">
            <input
              placeholder="Enter a prompt..."
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md outline-none bg-gray-300 placeholder:text-gray-800"
              value={userInput}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              disabled={loading}
              className="p-3 bg-purple-600 text-white rounded-full flex items-center justify-center"
            >
              <FaArrowUp />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AIChat;
