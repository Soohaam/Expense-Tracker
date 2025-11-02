import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "🤖 Hey there! I’m your AI Assistant — ready to help you anytime!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize Gemini 2.0 Flash
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // 🧠 Basic Markdown parser
  const formatResponse = (text) => {
    if (!text) return "";
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
      .replace(/\*(.*?)\*/g, "• $1") // Bullets
      .replace(/\n/g, "<br/>"); // Line breaks
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const prompt = `
      You are a helpful, friendly AI assistant inside a chatbot widget.
      Respond naturally and briefly, while being engaging and easy to understand.
      Use short bullet points if listing items.
      User message: ${input}`;

      const result = await model.generateContent(prompt);
      const response = await result.response.text();

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: formatResponse(response) },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "⚠️ Oops! Something went wrong. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Bubble Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-amber-600 text-white font-semibold rounded-full px-4 py-2 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-400/60 transition-all ${
          isOpen ? "hidden" : ""
        }`}
      >
        <img
          src="/Animatio.gif"
          alt="AI"
          className="w-8 h-8 rounded-full border border-emerald-400 shadow-md"
        />
        <span className="tracking-wide">AI</span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 100 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 bg-gray-900 border border-emerald-400/40 rounded-2xl shadow-2xl flex flex-col justify-between p-4 z-50 backdrop-blur-lg bg-opacity-95"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-2">
              <h2 className="text-emerald-400 font-semibold text-sm">
                🤖 AI Assistant
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-red-400 text-lg font-bold transition-all"
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div className="flex flex-col gap-3 overflow-y-auto h-72 p-2 bg-gray-800/80 rounded-lg scrollbar-thin scrollbar-thumb-emerald-500/30">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === "user" ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-2 rounded-xl max-w-[80%] text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-emerald-500/20 text-emerald-100 self-end text-right"
                      : "bg-gray-700/70 text-gray-100 self-start text-left"
                  }`}
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-emerald-300 text-sm animate-pulse"
                >
                  Thinking...
                </motion.div>
              )}
            </div>

            {/* Input Field */}
            <div className="flex items-center mt-3 gap-2">
              <input
                type="text"
                value={input}
                placeholder="Type your message..."
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 p-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:border-emerald-400 placeholder-gray-500"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSend}
                disabled={loading}
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-3 py-2 rounded-lg transition-all"
              >
                ➤
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
