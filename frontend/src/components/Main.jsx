import React, { useState } from "react";
import axios from "axios";
import { Newscard } from "./Newscard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Main() {
  const [location, setLocation] = useState("");
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const fetchNews = async () => {
    const isLoggedIn = localStorage.getItem("authToken"); // ✅ Replace with actual auth check

    if (!isLoggedIn) {
      toast.error("You must log in to access news.");
      return;
    }

    if (!location.trim()) {
      toast.warn("Please enter a valid location.");
      return;
    }

    setNewsData([]); // ✅ Clear previous news before fetching
    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:3000/api/news/${location.trim()}`);
      
      console.log("Backend response:", response.data);
      setNewsData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error("No news for this location, stay tuned...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* ✅ Fixed ToastContainer Configuration */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick />

      {/* Search Bar */}
      <div className="flex items-center ml-10 mt-6 space-x-4">
        <input
          type="text"
          placeholder="Enter location..."
          value={location}
          onChange={handleLocationChange}
          className="p-3 w-1/3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchNews}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-all"
        >
          Search News
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && <p className="text-center mt-4 text-lg text-gray-600">Loading news...</p>}

      {/* News Grid */}
      {newsData.length > 0 && !loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {newsData.map((news) => (
            <Newscard
              key={news._id}
              id={news._id}
              title={news.title}
              description={news.description}
              media={news.media}
              location={news.location}
              upvotes={news.upvotes}
              downvotes={news.downvotes}
              flags={news.flags}
              fetchNews={fetchNews}
            />
          ))}
        </div>
      )}

      {/* No News Found */}
      {newsData.length === 0 && !loading && (
        <p className="text-center mt-6 text-lg text-gray-500">No news found for "{location}".</p>
      )}
    </div>
  );
}
