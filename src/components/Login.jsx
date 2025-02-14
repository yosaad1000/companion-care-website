import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const url = import.meta.env.VITE_BACKEND_URL+'/users/login-doctor';
  const {setUser,setRefreshToken,setAccessToken} = useAuth();  
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    let formIsValid = true;
    let errorMessages = { email: '', password: '' };

    if (!email) {
      errorMessages.email = 'Email is required';
      formIsValid = false;
    }

    if (!password) {
      errorMessages.password = 'Password is required';
      formIsValid = false;
    }
    setErrors(errorMessages);

    if (formIsValid) {
      try {
        const response = await axios.post(url,{email,password},{
          headers:{
            "Content-Type":"application/json"
          }
        });
        const res = await response.data;
        if (res.success) {
          const { accessToken, refreshToken,doctor } = res.data;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken",refreshToken);
          localStorage.setItem("user",JSON.stringify(doctor));
          setUser(doctor);
          setRefreshToken(refreshToken);
          setAccessToken(accessToken);
        }
      } catch (error) {
        console.log("Error : ",error.response.data.message);
      }
      
    }
  }
  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="w-full max-w-7xl h-[92vh] flex gap-80">
        {/* Left side with logo */}
        <div className="flex-1 flex flex-col items-center justify-center ">
          <div className="text-center ml-auto">
            <img
              src="/assets/Logo.png"
              alt="Companion Care Logo"
              className="w-64 h-64 mb-4 mx-auto"
            />
            <h1 className="text-5xl font-black tracking-wide text-gray-900">
              COMPANION
            </h1>
            <h2 className="text-5xl font-black tracking-wide text-gray-900">
              CARE
            </h2>
          </div>
        </div>

        {/* Right side with login form */}
        <div className="flex-1 bg-gradient-to-br from-purple-900 to-purple-600 rounded-3xl px-25 py-12">
          <div className="max-w-md mx-auto">
            <h2 className="text-5xl font-bold mb-4 mt-12 text-white">
              Welcome
            </h2>
            <h2 className="text-5xl font-bold mb-10 text-white">
              Back
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1 relative">
                <label className="block text-xl text-white" htmlFor="email">Email</label>

                <input
                  id="email"
                  type="email"
                  onChange={(e) => { 
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: '' }));
                }}
                  className={`w-full px-8 py-3 rounded-full bg-purple-700/50 border ${errors.email?'border-red-400' :'border-purple-400'} focus:outline-none focus:border-white text-white`}
                />

                {errors.email && (
                  <p className="text-sm absolute right-0  text-red-400">{errors.email}</p>
                )}
              </div>

              <div className="space-y-1 relative">
                <label className="block text-xl text-white" htmlFor="password">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={isPasswordVisible ? 'text' : 'password'}
                    onChange={(e) => { 
                      setPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, password: '' }));
                  }}
                    className={`w-full px-6 py-3 rounded-full bg-purple-700/50 border ${errors.password?'border-red-400' :'border-purple-400'} focus:outline-none focus:border-white text-white`}
                  />

                  {isPasswordVisible ? (
                    <Eye
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-300 cursor-pointer"
                      size={20}
                      onClick={() => setIsPasswordVisible(false)}
                    />
                  ) : (
                    <EyeOff
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-300 cursor-pointer"
                      size={20}
                      onClick={() => setIsPasswordVisible(true)}
                    />
                  )}
                </div>
                {errors.password && (
                    <p className="text-sm absolute right-0  text-red-400">{errors.password}</p>
                  )}
              </div>

              <div className="flex flex-col items-center space-y-4 mt-8">
                <button
                  type="submit"
                  className="w-full py-3 bg-purple-700/50 text-white rounded-2xl font-bold text-lg hover:bg-gray-100 hover:text-purple-500 transition-colors border border-purple-400"
                >
                  Log In
                </button>

                <p className="text-lg text-white">
                  Don&apos;t Have Account?{' '}
                  <Link to="/signup" className="font-semibold underline hover:font-extrabold transition-all duration-100 ">
                    Sign Up
                  </Link>
                </p>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;