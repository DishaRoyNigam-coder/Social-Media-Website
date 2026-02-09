import React, { useContext, useRef, useState } from "react";
import { ShieldCheck, ArrowRight, Lock } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../App";

const OTP_LENGTH = 4;

const Forget = () => {
    let { formData } = useContext(DataContext);
    const nav = useNavigate();

    const [step, setStep] = useState("otp"); // otp | reset
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const inputRefs = useRef([]);

    // OTP handlers
    const handleChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Verify OTP
    const handleVerify = async () => {
        try {
            setLoading(true);

            const res = await axios.post("http://localhost:3000/verify-otp", {
                email: formData.email,
                otp: otp.join(""),
            });

            if (res.data.status) {
                toast.success(res.data.msg);
                setStep("reset"); // 🔥 move to reset password UI
            } else {
                toast.error(res.data.msg);
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Reset password
    const handleResetPassword = async () => {
        if (password.length < 6) {
            return toast.warning("Password must be at least 6 characters");
        }

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        try {
            setLoading(true);

            const res = await axios.post("http://localhost:3000/update-password", {
                email: formData.email,
                newPassword: confirmPassword
            });

            if (res.data.status) {
                toast.success(res.data.msg);
                setTimeout(() => nav("/auth"), 1000);
            } else {
                toast.error(res.data.msg);
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FBFBFB] flex flex-col justify-center py-12 px-6">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                        <ShieldCheck className="text-white w-7 h-7" />
                    </div>
                </div>

                <h2 className="text-center text-3xl font-bold text-gray-900 tracking-tight">
                    {step === "otp" ? "OTP Verification" : "Set New Password"}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-500">
                    {step === "otp"
                        ? "Enter the 4-digit code sent to you"
                        : "Choose a strong password for your account"}
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[440px]">
                <div className="bg-white py-10 px-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 rounded-3xl">

                    {/* OTP STEP */}
                    {step === "otp" && (
                        <>
                            <div className="flex justify-center gap-3 mb-8">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(e.target.value, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        className="h-14 w-14 rounded-2xl bg-gray-50 border border-gray-100 text-center text-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                ))}
                            </div>

                            <button
                                disabled={loading || otp.includes("")}
                                onClick={handleVerify}
                                className="w-full group flex items-center justify-center py-4 px-4 text-sm font-bold rounded-2xl text-white bg-gray-900 hover:bg-black transition-all shadow-xl shadow-gray-200 disabled:opacity-60"
                            >
                                Verify OTP
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </>
                    )}

                    {/* RESET PASSWORD STEP */}
                    {step === "reset" && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none border border-gray-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none border border-gray-100"
                                    />
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                onClick={handleResetPassword}
                                className="w-full group flex items-center justify-center py-4 px-4 text-sm font-bold rounded-2xl text-white bg-gray-900 hover:bg-black transition-all shadow-xl shadow-gray-200 disabled:opacity-60"
                            >
                                Update Password
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Forget;
