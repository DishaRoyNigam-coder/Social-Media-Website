import React, { useContext, useState } from "react";
import { Mail, Lock, User, ArrowRight, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { addToken, getToken } from "./Auth/jwt.js";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../App.jsx";

const AuthPage = () => {
    let {formData, setFormData} = useContext(DataContext);
    let nav = useNavigate();
    const [isLogin, setIsLogin] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLogin) {
            let data = await axios.post("http://localhost:3000/login", {
                email: formData.email,
                password: formData.password
            })

            if (data.data.status) {
                addToken(data.data.token);
                toast.success(data.data.msg);
                setTimeout(() => {
                    nav("/");
                }, 1000)
            } else {
                toast.warning(data.data.msg);
            }
        } else {
            let data = await axios.post("http://localhost:3000/signup", {
                username: formData.username,
                email: formData.email,
                password: formData.password
            })

            if (data.data.status) {
                addToken(data.data.token);
                toast.success(data.data.msg);
                setTimeout(() => {
                    nav("/");
                }, 1000);
            } else {
                toast.warning(data.data.msg);
            }
        }
    };

    let click_forget = async () => {
        try {
            if(!formData.email.trim()) {
                toast.info("Please Fill The Email First To Update The Password");
                return;
            }

            let data = await axios.post("http://localhost:3000/send-otp", {
                email: formData.email
            })

            if(data.data.status) {
                toast.success("Otp Has Been Sent To Your Email Address");
                nav("/forget-password");
            }else {
                toast.error("Internal Server Error");
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="min-h-screen bg-[#FBFBFB] flex flex-col justify-center py-12 px-6">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Branding */}
                <div className="flex justify-center mb-6">
                    <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                        <CheckCircle2 className="text-white w-7 h-7" />
                    </div>
                </div>
                <h2 className="text-center text-3xl font-bold text-gray-900 tracking-tight">
                    {isLogin ? "Welcome back" : "Create your account"}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-500">
                    {isLogin
                        ? "Enter your credentials to access your feed."
                        : "Join thousands of users sharing their stories."}
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[440px]">
                <div className="bg-white py-10 px-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 rounded-3xl">
                    {/* Form Toggle */}
                    <div className="flex p-1.5 bg-gray-50 rounded-2xl mb-10 border border-gray-100">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${isLogin
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${!isLogin
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="John Doe"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none border border-gray-100"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="name@company.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none border border-gray-100"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Password
                                </label>
                                {isLogin && (
                                    <p
                                        className="cursor-pointer text-xs font-bold text-blue-600 hover:text-blue-700"
                                        onClick={() => click_forget()}
                                    >
                                        Forgot password?
                                    </p>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none border border-gray-100"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full group flex items-center justify-center py-4 px-4 text-sm font-bold rounded-2xl text-white bg-gray-900 hover:bg-black transition-all shadow-xl shadow-gray-200"
                        >
                            {isLogin ? "Sign In" : "Get Started"}
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="ml-1 font-bold text-blue-600 hover:text-blue-700"
                        >
                            {isLogin ? "Sign up for free" : "Log in here"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
