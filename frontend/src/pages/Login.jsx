import axios from 'axios';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {

    const navigate = useNavigate();

    const [showPassword, setShowPassowrd] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log(formData);

        try {
            setIsLoading(true);
            const res = await axios.post(`http://localhost:8000/api/login`, formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })

            toast.success(res.data.message || "Logged in successfully");

            if(res.data.success){
                navigate('/');
            }

        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");

            console.log(err);
        } finally{
            setIsLoading(false);
        }
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                  Login to your Account
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Login
                </p>
            </div>

            <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1" >
            Email Address
            </label>
            <input
              id='email'
              type="email"
              placeholder="email"
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="mb-3">
                <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1" >
                Password
                </label>
              <div className="relative mb-3">
                <input
                id='password'
                type={showPassword ? "text" : "password"}
                placeholder="password"
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => {setShowPassowrd(!showPassword)}}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <Eye size={18}/> : <EyeOff size={18}/>}
              </button>
              </div>
            </div>

            <Link
              to="/forgot-password"
              className="block text-right text-sm text-indigo-600 hover:underline mb-4"
            >
              Forgot password?
            </Link>

            <button
              onClick={handleSubmit}
              className="
                w-full
                flex
                items-center
                justify-center
                gap-2
                py-2.5
                rounded-lg
                text-white
                font-medium
                bg-indigo-600
                hover:bg-indigo-700
                transition
                disabled:opacity-60
              "
            >
                {
                    isLoading ? (
                        <>
                          <Loader2 className="animate-spin" size={18}/>
                          Logging into your account....
                        </>
                    ) : "Login"
                }
            </button>
        </div>
      </div>
    </div>
  )
}

export default Login;
