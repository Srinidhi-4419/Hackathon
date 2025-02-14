import React, { useState } from 'react';
import { Heading } from '../pages/Heading';
import { Subheading } from '../pages/Subheading';
import { Inputbox } from '../pages/Inputbox';
import { Button } from '../pages/Button';
import { ButtonWarning } from '../pages/ButtonWarning';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signin = () => {
  const [formdata, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} with value: ${value}`); // Debugging log
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting formdata:", formdata); // Debugging log

    if (!formdata.username || !formdata.password) {
      setError("Email and Password are required");
      toast.error("Email and Password are required", { position: "top-center" });
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/signin', formdata, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('Response:', response.data);

      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        toast.success("Signin successful", { position: "top-center" });
        setTimeout(() => navigate('/news'), 2000); // Redirect after 2 seconds
      }
    } catch (error) {
      console.error('Error signing in:', error);
      const errorMessage = error.response?.data?.msg || 'Invalid username or password';
      setError(errorMessage);
      toast.error(errorMessage, { position: "top-center" });
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} /> {/* ✅ Ensure it's here */}
      <div className="flex h-screen bg-slate-300 justify-center">
        <div className="flex flex-col justify-center">
          <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
            <Heading label={"Sign in"} />
            <Subheading label={"Enter your information to sign in to your account"} />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Inputbox
              label={"Email"}
              placeholder="harkirat@gmail.com"
              name="username"
              type="email"
              onChange={handleChange}
              value={formdata.username}
            />
            <Inputbox
              label={"Password"}
              placeholder="******"
              name="password"
              type="password"
              onChange={handleChange}
              value={formdata.password}
            />
            <div className="pt-4">
              <Button label={"Sign in"} onClick={handleSubmit} />
            </div>
            <ButtonWarning label={"Don't have an account?"} Buttontext={"Sign Up"} to={"/signup"} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;
