import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const NewsFormAndList = () => {
  const [newsTitle, setNewsTitle] = useState('');
  const [newsDescription, setNewsDescription] = useState('');
  const [newsLocation, setNewsLocation] = useState('');
  const [newsFile, setNewsFile] = useState(null);
  const [mediaType, setMediaType] = useState('image'); // 'image' or 'video'
  const [news, setNews] = useState([]);
  const navigate = useNavigate();

  // Handle the news form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newsTitle || !newsDescription || !newsLocation) {
      alert('Please fill in all required fields!');
      return;
    }

    const formData = new FormData();
    formData.append('title', newsTitle);
    formData.append('description', newsDescription);
    formData.append('location', newsLocation);
    formData.append('mediaType', mediaType);

    if (newsFile) {
      formData.append('media', newsFile);
    }

    try {
      console.log('Submitting news form...');

      const response = await fetch('http://localhost:3000/api/news', {
        method: 'POST',
        body: formData,  
      });

      if (!response.ok) {
        throw new Error('Failed to upload news');
      }

      const data = await response.json();
      console.log('Response Data:', data);

      setNews((prevNews) => [...prevNews, data]);

      // Reset form
      setNewsTitle('');
      setNewsDescription('');
      setNewsLocation('');
      setNewsFile(null);
      navigate('/news');
      toast.success("Reported news successfully");
    } catch (error) {
      console.error('Error uploading news:', error);
      alert('There was an error submitting the news. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg space-y-6 bg-white p-6 rounded-lg shadow-md">
        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Report A News</h2>

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
              {mediaType === 'image' ? 'Upload Image (Optional)' : 'Upload Video (Optional)'}
            </label>
            <input
              type="file"
              accept={mediaType === 'image' ? 'image/*' : 'video/*'}
              onChange={(e) => setNewsFile(e.target.files[0])}
              className="w-full border border-gray-300 p-2 rounded-md"
            />
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md mt-4">
            Submit News
          </button>
        </form>

        {/* News List Section */}
        <div className="w-full max-w-4xl mx-auto mt-6">
          {news.length === 0 ? (
            <p className="text-center text-white text-lg font-semibold">No news items to display.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {news.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-sm text-gray-400">{item.location}</p>
                  {item.mediaType === 'image' && item.mediaUrl && (
                    <img src={item.mediaUrl} alt={item.title} className="w-full h-auto mt-2" />
                  )}
                  {item.mediaType === 'video' && item.mediaUrl && (
                    <video src={item.mediaUrl} controls className="w-full h-auto mt-2" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsFormAndList;
