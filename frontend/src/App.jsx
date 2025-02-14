import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Main } from './components/Main';
import Signin from './components/Signin';
import { SignUp } from './components/SignUp';
import NewsForm from './components/NewsForm';
import NewsList from './components/NewsList';
import NewsFormAndList from './components/NewsFormAndList';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { All } from './components/All';
import { Detail } from './components/Detail';

function App() {
  const [news, setNews] = useState([]);

  const addNewsItem = (newNews) => {
    setNews((prevNews) => [...prevNews, newNews]);
  };

  return (
    <BrowserRouter>
      {/* ToastContainer component is added here to enable toast notifications throughout the app */}
      <ToastContainer />
      <Routes>
        <Route path="/" element={<><Navbar /><Main /></>} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/report-news" element={<><Navbar /><NewsFormAndList /></>} />
        <Route path="/news" element={<><Navbar /><All/></>} />
        <Route path="/news/:id" element={<><Navbar/><Detail /></>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
