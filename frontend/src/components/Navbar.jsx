import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    navigate("/news");
  };

  const handleReportNewsClick = () => {
    if (!isLoggedIn) {
      toast.error("You must be signed in to report news.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="flex items-center justify-between bg-black p-4">
      <div className="text-2xl font-normal font-sans text-white flex space-x-3">
        <img src="https://play-lh.googleusercontent.com/j3DcAf5wbhF5GIZ7PWqbb7ElUtfBhqVZmIdHQl6Xwby1RGyQbbKnjDHlYtn5irhNu1o" className="h-10 w-10" alt="Logo" />
        <Link to="/" className="hover:bg-gray-700 p-2 rounded-md">Newser</Link>
      </div>
      
      <div className="flex items-center space-x-4 ml-auto">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-white font-semibold hover:bg-gray-700 px-4 py-2 rounded-md"
          >
            Sign Out
          </button>
        ) : (
          <Link
            to="/signin"
            className="text-white font-semibold hover:bg-gray-700 px-4 py-2 rounded-md"
          >
            Sign In
          </Link>
        )}

        <Link
          to={isLoggedIn ? "/report-news" : "#"}
          className="text-white font-semibold hover:bg-gray-700 px-4 py-2 rounded-md"
          onClick={handleReportNewsClick}
        >
          Report News
        </Link>

        <Link
          to="/news"
          className="text-white font-semibold hover:bg-gray-700 px-4 py-2 rounded-md"
        >
          All News
        </Link>
      </div>
    </div>
  );
}