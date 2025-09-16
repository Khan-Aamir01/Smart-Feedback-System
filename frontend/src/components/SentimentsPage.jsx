import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext"; // adjust path

const SentimentsPage = () => {
  const [sentiments, setSentiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { dark } = useTheme();

  useEffect(() => {
    const fetchSentiments = async () => {
      try {
        const res = await fetch("http://localhost:5000/sentiments");
        const data = await res.json();
        setSentiments(data);
      } catch (err) {
        console.error("Error fetching sentiments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSentiments();
  }, []);

  if (loading) {
    return (
      <div
        className={`flex flex-col items-center justify-center min-h-screen ${
          dark ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div
          className={`w-16 h-16 border-4 rounded-full animate-spin ${
            dark
              ? "border-blue-500 border-dashed border-t-gray-700"
              : "border-blue-400 border-dashed border-t-gray-200"
          }`}
        ></div>
        <p className={`${dark ? "text-gray-300" : "text-gray-600"} mt-4`}>
          Loading sentiments…
        </p>
      </div>
    );
  }

  return (
    <div className={`${dark ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-900"} min-h-screen py-10 px-4`}>
      <h1 className="text-3xl font-bold text-center mb-8">
        Sentiments Dashboard
      </h1>

      <div className="max-w-3xl mx-auto space-y-4">
        {sentiments.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No sentiments found
          </p>
        ) : (
          sentiments.map((item) => (
            <div
              key={item.id}
              className={`p-6 rounded-xl shadow-lg transition transform hover:scale-105 ${
                dark
                  ? "bg-gray-800 border border-gray-700 hover:bg-gray-700"
                  : "bg-white border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <p className="text-lg font-semibold mb-2">
                Feedback:
                <span className="font-normal ml-2">{item.translated_text}</span>
              </p>
              <p className="text-sm mb-1">
                Rating:
                <span className="font-medium ml-2">{item.rating}</span>
              </p>
              <p className="text-sm">
                Score:
                <span className="font-medium ml-2">{item.confidence}</span>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SentimentsPage;


