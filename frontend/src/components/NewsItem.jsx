import React from 'react';

const NewsItem = ({ newsItem }) => {
  const { title, description, media, location, mediaType } = newsItem;

  // Ensure media exists and has a valid path
  const imageUrl = media?.path ? `http://localhost:3000${media.path}` : '';

  return (
    <div className="border border-gray-300 p-6 rounded-lg shadow-md mb-6 w-full max-w-lg">
      <h3 className="text-xl font-semibold text-green-600">{title}</h3>
      <p className="text-gray-700 mt-2">{description}</p>
      <p className="text-sm text-gray-500 mt-2">Location: {location}</p>

      {/* Media Rendering */}
      {media && imageUrl ? (
        mediaType === 'image' ? (
          <img
            src={imageUrl}
            alt={`News related to ${title}`}
            className="mt-4 w-full h-auto rounded-md"
          />
        ) : (
          <video controls className="mt-4 w-full h-auto rounded-md">
            <source src={imageUrl} type={media.contentType} />
            Your browser does not support the video tag.
          </video>
        )
      ) : (
        <p className="text-sm text-gray-500 mt-2">No media available</p>
      )}
    </div>
  );
};

export default NewsItem;
