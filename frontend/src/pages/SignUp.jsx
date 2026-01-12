import axios from 'axios';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SignUp = () => {

    const navigate = useNavigate();

    const [showPassword, setShowPassowrd] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
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
            const res = await axios.post(`http://localhost:8000/api/register`, formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })

            toast.success(res.data.message || "Registered successfully");

            if(res.data.success){
                navigate('/verify');
            }

        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
            console.log(err);
            console.error(err); // new
        } finally{
            setIsLoading(false);
        }
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <div>
            <div>
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Create your Account
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        SIGNUP
                    </p>
                </div>

                <input
                  type="text"
                  placeholder="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="email"
                  placeholder="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="relative mb-4">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="password"
                      required
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    />
                    <button
                      onClick={() => {setShowPassowrd(!showPassword)}}
                      disabled={isLoading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                        {showPassword ? <Eye size={18}/> : <EyeOff size={18}/>}
                    </button>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-70"
                >
                    {
                        isLoading ? (
                        <>
                          <Loader2 className="animate-spin" size={18}/>
                          Creating account...
                        </>
                        ) : "Sign up"
                    }
                </button>
            </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp;
