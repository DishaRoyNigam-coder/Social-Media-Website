import React from "react";
import { ArrowRight } from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-6">
      <div className="max-w-3xl w-full text-center">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-1.5 mb-6 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
          ✨ Welcome
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
          Build.
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {" "}
            Share.
          </span>
          <br />
          Grow together.
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
          A clean and modern space to share your thoughts, connect with others,
          and grow your ideas — all in one place.
        </p>

        {/* Actions */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black transition-all shadow-lg shadow-gray-300">
            Get Started
            <ArrowRight className="w-4 h-4" />
          </button>

          <button className="px-6 py-3 rounded-xl bg-white text-gray-900 font-semibold border border-gray-200 hover:bg-gray-50 transition-all">
            Learn More
          </button>
        </div>

        {/* Footer note */}
        <p className="mt-12 text-sm text-gray-400">
          Designed with simplicity & clarity in mind.
        </p>
      </div>
    </div>
  );
}

export default Home;
