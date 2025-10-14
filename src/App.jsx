import { useState, useRef, useEffect } from "react";
import axios from 'axios';

function App() {
  const [suggest, setSuggest] = useState([
    "Know about Focus",
    "Build chatbot",
    "Almost Everything",
  ]);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState([]);

  const messagesEndRef = useRef(null); // Ref for auto-scroll

  const ai_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyCnL-2dQAld4pEVjoaWPZYM0BF4QdJlAGE";

  const handleSubmit = async () => {
    if (!input.trim()) return; // prevent empty messages

    let usermessage = { sender: "user", text: input };
    setMessage(prev => [...prev, usermessage]);

    const data = {
      contents: [
        { parts: [{ text: input }] }
      ]
    };

    try {
      const response = await axios.post(ai_url, data, {
        headers: { "Content-Type": "application/json" }
      });

      if (
        response.data &&
        response.data.candidates &&
        response.data.candidates[0].content.parts[0].text
      ) {
        let aimessage = {
          sender: "ai",
          text: response.data.candidates[0].content.parts[0].text
        };
        setMessage(prev => [...prev, aimessage]);
      } else {
        setMessage(prev => [...prev, { sender: "ai", text: "Sorry, I am not able to answer this question." }]);
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage(prev => [...prev, { sender: "ai", text: "Something went wrong. Please try again." }]);
    }

    setInput("");
  };

  // Scroll to bottom whenever message changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div className="bg-black flex flex-col h-screen">
      {/* Header */}
      <img
        className="ml-[500px]"
        src="https://i.gifer.com/OpeH.gif"
        alt="Trippy Rainbow"
        style={{ width: "200px", height: "auto" }}
      />
      <div className="flex items-center justify-center bg-black">
        <h1 className="text-4xl font-bold text-white">Hey Vaira!</h1>
      </div>
      <p className="text-center text-white text-xl">What's   on   your   mind   Today?</p>

      {/* Suggestion cards */}
      <div className="mt-2 ml-[100px] grid grid-cols-3 gap-2 p-4 text-center mr-[100px]">
        {suggest.map((sug, index) => (
          <div key={index} className="text-white shadow-[0_4px_15px_rgba(255,255,255,0.3)] p-2 rounded">
            {sug}
          </div>
        ))}
      </div>

      {/* Chat container */}
      <div className="flex-1 overflow-y-auto px-4 mt-4 space-y-3 text-white mb-20">
        {message.map((sug, index) => (
          <div
            key={index}
            className={`p-2 rounded w-fit max-w-[60%] text-white shadow-[0_4px_15px_rgba(255,255,255,0.3)] ${
              sug.sender === "user" ? "ml-auto bg-gray-950" : "mr-auto bg-gray-950"
            }`}
          >
            <p>{sug.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Scroll target */}
      </div>

      {/* Input field fixed at bottom */}
      <div className=" absolute left-[200px] top-[500px] flex gap-0.5 p-4 border-t border-gray-600 bg-black">
        <input
          className="w-[800px]  flex-1 bg-white border border-gray-500 shadow-[0_4px_15px_rgba(255,255,255,0.3)] p-2 rounded"
          type="text"
          value={input}
          placeholder="Ask Me Anything"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if(e.key === 'Enter') handleSubmit(); }}
        />
        <button className="border-2 border-white p-2 rounded" onClick={handleSubmit}>🚀</button>
      </div>
    </div>
  );
}

export default App;
