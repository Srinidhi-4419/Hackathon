import React, { useState } from 'react';
import { Heading } from '../pages/Heading';
import { Subheading } from '../pages/Subheading';
import { Inputbox } from '../pages/Inputbox';
import { Button } from '../pages/Button';
import { ButtonWarning } from '../pages/ButtonWarning';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
export const SignUp = () => {
  const [formdata, setFormData] = useState({
    username: '',
    password: '',
    firstname: '',
    lastname: '',
  });

  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formdata); // Log formdata to check if it's populated correctly

    try {
      const response = await axios.post(
        'http://localhost:3000/api/signup',
        formdata,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log('Response:', response.data);

      // After successful sign-up, redirect to /funds
      if (response.data.token) {
        localStorage.setItem('authToken',response.data.token)
        navigate('/news'); 
        toast.success("Sign Up successful");
        
      }

    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <>
      <div className='flex h-screen bg-slate-300 justify-center'>
        <div className='flex flex-col justify-center'>
          <div className='rounded-lg bg-white w-80 text-center p-2 h-max px-4'>
            <Heading label={'Sign up'} />
            <Subheading label={'Enter your information to create an account'} />

            <Inputbox
              label={'First Name'}
              placeholder='John'
              name='firstname'
              onChange={(e) => setFormData({ ...formdata, firstname: e.target.value })}
              value={formdata.firstname}
            />
            <Inputbox
              label={'Last Name'}
              placeholder='Doe'
              name='lastname'
              onChange={(e) => setFormData({ ...formdata, lastname: e.target.value })}
              value={formdata.lastname}
            />
            <Inputbox
              label={'Email'}
              placeholder='harkirat@gmail.com'
              name='username'
              onChange={(e) => setFormData({ ...formdata, username: e.target.value })}
              value={formdata.username}
            />
            <Inputbox
              label={'Password'}
              placeholder='123456'
              name='password'
              onChange={(e) => setFormData({ ...formdata, password: e.target.value })}
              value={formdata.password}
            />
            <div className='pt-4'>
              <Button label={'Sign Up'} onClick={handleSubmit} />
            </div>
            <ButtonWarning label={'Already have an account?'} Buttontext={'Sign in'} to={'/signin'} />
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
