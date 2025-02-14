import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Newscard } from './Newscard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function All() {
  const [newsData, setNewsData] = useState([]);

  const fetchNews = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/news');
      console.log("Fetched news:", response.data); // Debugging log
      setNewsData(response.data.filter(news => news?._id)); // Store only valid news
    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error("Failed to fetch news. Try again later.");
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div>
      <ToastContainer />
      <h2 className="text-center text-xl font-bold my-4">All News</h2>

      {newsData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {newsData.map(news => (
            <Newscard
              key={news._id}
              id={news._id}
              title={news.title || "No Title"}
              description={news.description || "No description"}
              media={news.media || ""}
              location={news.location || "Unknown"}
              upvotes={news.upvotes || 0}
              downvotes={news.downvotes || 0}
              flags={news.flags || 0}
              fetchNews={fetchNews} // Pass fetchNews function to Newscard
            />
          ))}
        </div>
      ) : (
        <p className="text-center mt-4 text-gray-500">No news available, stay tuned...</p>
      )}
    </div>
  );
}
