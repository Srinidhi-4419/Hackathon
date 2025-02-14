import axios from "axios";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import placeholderImage from "./image.png"; // Ensure the correct path

export function Newscard({ id, title, description, media, location, fetchNews }) {
  const [userVote, setUserVote] = useState(null);
  const [userFlagged, setUserFlagged] = useState(false);
  const [localUpvotes, setLocalUpvotes] = useState(0);
  const [localDownvotes, setLocalDownvotes] = useState(0);
  const [localFlags, setLocalFlags] = useState(0);

  const authToken = localStorage.getItem("authToken");
  const isUserSignedIn = !!authToken;

  useEffect(() => {
    fetchUserVote();
  }, [id, authToken]);

  const fetchUserVote = async () => {
    if (!authToken) {
      console.error("No auth token found, user is not logged in.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/api/news/user-votes/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.data) {
        setUserVote(response.data.userVote);
        setLocalUpvotes(response.data.overallVotes.upvotes);
        setLocalDownvotes(response.data.overallVotes.downvotes);
        setLocalFlags(response.data.overallVotes.flags);
        setUserFlagged(response.data.userFlagged);
      }
    } catch (error) {
      console.error("Error fetching user vote:", error.response?.data || error.message);
    }
  };

  const handleVote = async (voteType) => {
    if (!authToken) {
      toast.error("You must be logged in to vote!");
      return;
    }

    if (userVote) {
      toast.error("You have already voted. You cannot change your vote.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/news/vote",
        { id, voteType },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      toast.success(response.data.message);
      setUserVote(voteType);

      if (voteType === "upvote") {
        setLocalUpvotes((prev) => prev + 1);
      } else {
        setLocalDownvotes((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error handling vote:", error.response?.data || error.message);
      toast.error("Failed to submit vote.");
    }
  };

  const handleFlag = async () => {
    if (!authToken) {
      toast.error("You must be logged in to report this news!");
      return;
    }

    if (userFlagged) {
      toast.error("You have already reported this news.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/news/flag",
        { id },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      toast.success(response.data.message);
      setUserFlagged(true);
      setLocalFlags((prev) => prev + 1);
    } catch (error) {
      console.error("Error handling flag:", error.response?.data || error.message);
      toast.error("Failed to report news.");
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-xl hover:shadow-2xl transition-all cursor-pointer border border-gray-300">
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Media Display */}
      <div className="w-full h-52 bg-gray-300 rounded-lg overflow-hidden flex items-center justify-center">
        {media?.path ? (
          media.contentType?.startsWith("image") ? (
            <img
              src={`http://localhost:3000/${media.path}`}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => (e.target.src = placeholderImage)}
            />
          ) : media.contentType?.startsWith("video") ? (
            <video controls className="w-full h-full">
              <source src={`http://localhost:3000/${media.path}`} type={media.contentType} />
            </video>
          ) : (
            <img src={placeholderImage} alt="Default media" className="w-full h-full object-cover" />
          )
        ) : (
          <img src={placeholderImage} alt="Default media" className="w-full h-full object-cover" />
        )}
      </div>

      {/* News Details */}
      <h3 className="mt-4 text-2xl font-extrabold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500">Location: {location}</p>
      <p className="text-gray-700 mt-2">{description}</p>

      {/* Voting & Flagging Buttons */}
      <div className="mt-5 flex justify-between">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleVote("upvote");
          }}
          className={`bg-green-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            userVote ? "opacity-50 cursor-not-allowed" : "hover:scale-105 cursor-pointer"
          }`}
          disabled={!!userVote}
        >
          <img src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png" alt="upvote" className="w-6 h-6" /> {localUpvotes}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleVote("downvote");
          }}
          className={`bg-red-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            userVote ? "opacity-50 cursor-not-allowed" : "hover:scale-105 cursor-pointer"
          }`}
          disabled={!!userVote}
        >
          <img src="https://cdn-icons-png.flaticon.com/512/992/992683.png" alt="downvote" className="w-6 h-6" /> {localDownvotes}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFlag();
          }}
          className={`bg-yellow-500 text-white flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            userFlagged ? "opacity-50 cursor-not-allowed" : "hover:scale-105 cursor-pointer"
          }`}
          disabled={userFlagged}
        >
          🚩 {localFlags}
        </button>
      </div>
    </div>
  );
}
