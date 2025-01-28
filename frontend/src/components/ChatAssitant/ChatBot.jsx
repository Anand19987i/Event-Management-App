import { FaArrowUp, FaCopy } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import MenuBar from "@/Host/MenuBar";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { CHATBOT_API_END_POINT } from "@/utils/constant";
import { BiCreditCard, BiSolidCommentDetail } from "react-icons/bi";
import { RiCustomerService2Line } from "react-icons/ri";
import "./ChatBot.css";

const ChatBot = () => {
  const [userInput, setUserInput] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e) => setUserInput(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInput.trim()) {
      setError("What you want to Ask ?.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${CHATBOT_API_END_POINT}/eventify/api/v1/ai-assistant/chatbot`,
        { message: userInput }
      );

      const botResponse =
        typeof data.reply === "string" ? data.reply : JSON.stringify(data.reply);

      setResponses((prev) => [
        ...prev,
        { sender: "user", text: userInput },
        { sender: "bot", text: botResponse },
      ]);
    } catch (error) {
      console.error("Error in chatbot communication:", error);
      setResponses((prev) => [
        ...prev,
        { sender: "user", text: userInput },
        { sender: "bot", text: "Sorry, something went wrong. Please try again later." },
      ]);
    } finally {
      setLoading(false);
      setUserInput("");
    }
  };

  const renderMessage = (text) => {
    // Format headings (make them bold and blue)
    text = text.replace(/^(#\s?)(.*)/gm, '<span class="text-blue-600 font-bold">$2</span>');
  
    // Format numbered list items (make numbers green)
    text = text.replace(/^\d+\./gm, (match) => `<span class="text-green-500">${match}</span>`);
  
    // Handle line breaks and rendering as paragraphs
    return text.split("\n").map((line, index) => (
      <p key={index} className="text-sm text-black" dangerouslySetInnerHTML={{ __html: line }} />
    ));
  };
  

  const texts = ["Frequently Asked Questions", "Welcome to Eventify Service"];
  const [currentText, setCurrentText] = useState(texts[0]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
      setCurrentText(texts[(index + 1) % texts.length]);
    }, 4000); // Adjust timing as needed

    return () => clearInterval(interval);
  }, [index]);

  return (
    <>
      <Navbar />
      <div className="font-montserrat flex flex-col h-96">
        {!loading && responses.length === 0 && (
          <div className="relative top-20">
            <p className="absolute top-[22%] left-[35%] font-semibold text-3xl typing-text ">
              {currentText}
            </p>

            <div className="">
              <div className="w-48 h-48 bg-gray-200 rounded-sm absolute top-16 left-[30%]">
                <p className="text-left mt-10 p-2 px-5 font-semibold">Can I get Event Details ?</p>
                <div className=" absolute right-4 bottom-3 h-10 w-10 bg-white rounded-full">
                  <BiSolidCommentDetail className="absolute left-2 top-2 h-6 w-6" />
                </div>
              </div>
              <div className="w-48 h-48 bg-gray-200 rounded-sm absolute top-16 left-[60%]">
                <p className="text-left mt-10 p-2 px-5 font-semibold">How to cancel a booked event ?</p>
                <div className=" absolute right-4 bottom-3 h-10 w-10 bg-white rounded-full">
                  <RiCustomerService2Line className="absolute left-2 top-2 h-6 w-6" />
                </div>
              </div>
              <div className="w-48 h-48 bg-gray-200 rounded-sm absolute top-16 left-[45%]">
                <p className="text-left mt-10 p-2 px-5 font-semibold">How can get a payment refund ?</p>
                <div className=" absolute right-4 bottom-3 h-10 w-10 bg-white rounded-full">
                  <BiCreditCard className="absolute left-2 top-2 h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Chat Section */}
        <div className="flex-grow p-4">
          {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

          <div className="w-full max-w-3xl mx-auto bg-white rounded-lg p-4 h-96 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center h-full">
                <div className="loader">Loading...</div>
              </div>
            )}
            <div className="space-y-4">
              {responses.map((res, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${res.sender === "user" ? "bg-purple-100 text-right" : "bg-gray-100"}`}
                >
                  {renderMessage(res.text)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="w-full mb-56 p-4">
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 items-center max-w-3xl mx-auto bg-gray-200 p-2 rounded-lg"
          >
            <input
              placeholder="What you want to Ask?"
              className="flex-grow px-4 py-2 bg-gray-200 rounded-md outline-none"
              value={userInput}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              disabled={loading}
              className="p-3 bg-purple-600 text-white rounded-full flex items-center justify-center"
            >
              {loading ? <span className="loader">...</span> : <FaArrowUp />}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
