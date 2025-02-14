import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const SignupPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phNo, setPhNo] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [confirmpassword, setConfirmpassword] = useState("");
    const [isconfirmpasswordVisible, setIsConfirmpasswordVisible] = useState(false);
    const [errors, setErrors] = useState({ email: '',phNo:'', password: '', name: '', confirmpassword: '' });
    const url = import.meta.env.VITE_BACKEND_URL+'/users/register-doctor';
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
        if (!phNo) {
            errorMessages.phNo = 'Phone number is required';
            formIsValid = false;
        }
        if (!name) {
            errorMessages.name = 'Name is required';
            formIsValid = false;
        }
        if (!confirmpassword) {
            errorMessages.confirmpassword = 'Confirm you password';
            formIsValid = false;
        }else if(confirmpassword!=password){
            errorMessages.confirmpassword = 'Password does not match';
            formIsValid = false;
        }
        setErrors(errorMessages);

        if (formIsValid) {
            try {
                const response = await axios.post(url,{name,email,password,role:"doctor",phNo},{
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
        <div className="h-screen bg-gradient-to-br from-purple-900 to-purple-600  flex items-center justify-center">
            <div className="w-full max-w-7xl  h-[92vh] flex">

                <div className="flex-1 px-25">
                    <div className="max-w-sm">
                        <h2 className="text-5xl font-bold mb-2 text-white">
                            Create
                        </h2>
                        <h2 className="text-5xl font-bold mb-5 text-white">
                            New Account
                        </h2>

                        <form className="space-y-2" onSubmit={handleSubmit}>
                            <div className="space-y-1 relative">
                                <label className="block text-xl text-white">Name</label>
                                <input
                                    type="name"
                                    onChange={(e) => { 
                                        setName(e.target.value);
                                        setErrors((prev) => ({ ...prev, name: '' }));
                                    }}
                                    className={`w-full px-8  py-3 rounded-full bg-purple-700/50 border ${errors.name?'border-red-400' :'border-purple-400'} focus:outline-none focus:border-white text-white`}
                                />
                                {errors.name && (
                                    <p className="text-sm absolute right-0  text-red-400 ">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-1 relative">
                                <label className="block text-xl text-white">Email</label>
                                <input
                                    type="email"
                                    onChange={(e) => { 
                                        setEmail(e.target.value);
                                        setErrors((prev) => ({ ...prev, email: '' }));
                                    }}
                                    className={`w-full px-8 py-3 rounded-full bg-purple-700/50 border ${errors.email?'border-red-400' :'border-purple-400'} focus:outline-none focus:border-white text-white`}
                                />
                                {errors.email && (
                                    <p className="text-sm absolute right-0 text-red-400 ">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-1 relative">
                                <label className="block text-xl text-white">Phone Number</label>
                                <input
                                    type="text"
                                    onChange={(e) => { 
                                        setPhNo(e.target.value);
                                        setErrors((prev) => ({ ...prev, phNo: '' }));
                                    }}
                                    className={`w-full px-8 py-3 rounded-full bg-purple-700/50 border ${errors.phNo?'border-red-400' :'border-purple-400'} focus:outline-none focus:border-white text-white`}
                                />
                                {errors.phNo && (
                                    <p className="text-sm absolute  right-0 text-red-400 ">{errors.phNo}</p>
                                )}
                            </div>

                            <div className="space-y-1 relative">
                                <label className="block text-xl text-white">Password</label>
                                <div className="relative">
                                    <input
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
                                    <p className="text-sm absolute right-0 text-red-400 ">{errors.password}</p>
                                )}
                            </div>
                            <div className="space-y-1 relative">
                                <label className="block text-xl text-white">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type={isconfirmpasswordVisible ? 'text' : 'password'}
                                        onChange={(e) => { 
                                            setConfirmpassword(e.target.value);
                                            setErrors((prev) => ({ ...prev, confirmpassword: '' }));
                                        }}
                                        className={`w-full px-6 py-3 rounded-full bg-purple-700/50 border ${errors.confirmpassword?'border-red-400' :'border-purple-400'} focus:outline-none focus:border-white text-white`}
                                    />
                                    {isconfirmpasswordVisible ? (
                                        <Eye
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-300 cursor-pointer"
                                            size={20}
                                            onClick={() => setIsConfirmpasswordVisible(false)}
                                        />
                                    ) : (
                                        <EyeOff
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-300 cursor-pointer"
                                            size={20}
                                            onClick={() => setIsConfirmpasswordVisible(true)}
                                        />
                                    )}
                                </div>
                                {errors.confirmpassword&& (
                                    <p className="text-sm absolute right-0 text-red-400 ">{errors.confirmpassword}</p>
                                )}
                            </div>

                            <div className="flex flex-col items-center space-y-3 mt-8">
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-purple-700/50 text-white rounded-2xl font-bold text-lg hover:bg-gray-100 hover:text-purple-500 transition-colors border border-purple-400"
                                >
                                    Sign Up
                                </button>

                                <p className="text-lg text-white">
                                    Already Have An Account?{' '}
                                    <Link to="/login" className="font-semibold underline hover:font-extrabold transition-all duration-100">
                                        Log In
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
                {/* Left side with logo */}
                <div className="flex-1 flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100">
                    <div className="text-center">
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

            </div>
        </div>
    );
};

export default SignupPage;