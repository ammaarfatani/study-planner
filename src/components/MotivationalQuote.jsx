import { useEffect, useState } from "react";

const QUOTES = [
  "Focus on being productive, not busy.",
  "Small progress is still progress.",
  "Success is the sum of small efforts repeated daily.",
  "Stay focused. Stay disciplined.",
  "Your future depends on what you do today.",
];

const MotivationalQuote = () => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  return (
    <div className="bg-indigo-600 text-white p-4 rounded-xl shadow text-center">
      <p className="italic">“{quote}”</p>
    </div>
  );
};

export default MotivationalQuote;
