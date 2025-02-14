import React from "react";
import NewsItem from "./NewsItem";

const NewsList = ({ news }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      {news.length === 0 ? (
        <p className="text-center text-white text-lg font-semibold">
          No news items to display.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {news.map((item, index) => (
            <NewsItem key={index} newsItem={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsList;