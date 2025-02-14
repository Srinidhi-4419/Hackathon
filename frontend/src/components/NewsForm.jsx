import React, { useState } from 'react';

const NewsForm = ({ onAddNews }) => {
  const [newsTitle, setNewsTitle] = useState('');
  const [newsDescription, setNewsDescription] = useState('');
  const [newsFile, setNewsFile] = useState(null);
  const [newsLocation, setNewsLocation] = useState('');
  const [mediaType, setMediaType] = useState('image');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newsTitle || !newsDescription || !newsLocation || !newsFile) {
      setErrorMessage('Please fill in all fields and attach a file!');
      return;
    }

    // Optional: Check file size for videos
    if (mediaType === 'video' && newsFile.size > 50000000) { // 50MB limit for videos
      setErrorMessage('File size exceeds the maximum allowed limit (50MB)');
      return;
    }

    const formData = new FormData();
    formData.append('title', newsTitle);
    formData.append('description', newsDescription);
    formData.append('location', newsLocation);
    formData.append('mediaType', mediaType);
    formData.append('media', newsFile);

    try {
      const response = await fetch('http://localhost:3000/api/news', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload news');
      }

      const data = await response.json();
      onAddNews(data); // Update the UI with the new news

      // Reset form fields after submission
      setNewsTitle('');
      setNewsDescription('');
      setNewsLocation('');
      setNewsFile(null);
      setErrorMessage(''); // Reset error message
    } catch (error) {
      console.error('Error uploading news:', error);
      setErrorMessage('There was an error submitting the news. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Report A News</h2>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-200 text-red-700 p-2 rounded-md">
            {errorMessage}
          </div>
        )}

        <div>
          <label className="block font-medium text-lg mb-2">Title</label>
          <input
            type="text"
            value={newsTitle}
            onChange={(e) => setNewsTitle(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-lg mb-2">Description</label>
          <textarea
            value={newsDescription}
            onChange={(e) => setNewsDescription(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-lg mb-2">Location</label>
          <input
            type="text"
            value={newsLocation}
            onChange={(e) => setNewsLocation(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md"
            required
          />
        </div>

        <div className="flex space-x-4">
          <div>
            <label className="font-medium text-lg">Choose Media Type:</label>
            <div className="flex space-x-4">
              <label className="cursor-pointer">
                <input type="radio" checked={mediaType === 'image'} onChange={() => setMediaType('image')} />
                Image
              </label>
              <label className="cursor-pointer">
                <input type="radio" checked={mediaType === 'video'} onChange={() => setMediaType('video')} />
                Video
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block font-medium text-lg mb-2">
            {mediaType === 'image' ? 'Upload Image' : 'Upload Video'}
          </label>
          <input
            type="file"
            accept={mediaType === 'image' ? 'image/*' : 'video/*'}
            onChange={(e) => setNewsFile(e.target.files[0])}
            className="w-full border border-gray-300 p-2 rounded-md"
            required
          />
        </div>

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md mt-4">
          Submit News
        </button>
      </form>
    </div>
  );
};

export default NewsForm;
