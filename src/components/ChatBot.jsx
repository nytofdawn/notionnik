import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

// Replace with your Make webhook URL
const WEBHOOK_URL = "https://hook.eu1.make.com/e45kq4zc7creuxjtjgk0b6ok9uryct1m";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Load messages from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("chat_messages");
    if (saved) setMessages(JSON.parse(saved));
    else setMessages([{ sender: "bot", text: "Hi! How can I help you today?" }]);
  }, []);

  // Save messages to LocalStorage & scroll to bottom
  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChat = () => setIsOpen(prev => !prev);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { sender: "user", text: userMessage }]);
    setIsSending(true);

    try {
      // Send full conversation to Make webhook
      const payload = { conversation: [...messages, { sender: "user", text: userMessage }] };

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Parse plain text reply from Make
      const botReply = await response.text();

      setMessages(prev => [
        ...prev,
        { sender: "bot", text: botReply || "We'll respond soon." },
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Oops! Something went wrong. Please try again." },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="w-80 h-[400px] bg-white shadow-lg rounded-lg flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-2 rounded-t-lg font-semibold">
            Chat with us
          </div>

          {/* Messages */}
          <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg.sender === "user"
                    ? "self-end bg-blue-100 text-gray-800"
                    : "self-start bg-gray-100 text-gray-800"
                } px-3 py-2 rounded-lg max-w-[70%] break-words`}
              >
                {msg.sender === "bot" ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
              </div>
            ))}

            {/* Typing indicator */}
            {isSending && (
              <div className="self-start bg-gray-100 text-gray-800 px-3 py-2 rounded-lg max-w-[70%] animate-pulse">
                Bot is typing...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex p-2 border-t border-gray-200">
            <input
              type="text"
              className="flex-1 border rounded px-2 py-1 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isSending}
            />
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition disabled:opacity-50"
              onClick={handleSend}
              disabled={isSending}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        onClick={toggleChat}
      >
        {isOpen ? "×" : "💬"}
      </button>
    </div>
  );
}