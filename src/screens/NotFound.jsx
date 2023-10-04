import React from "react";
import { Link } from "react-router-dom";

// This component displays 404 not found page if user tries to visit incorrect url
const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-2xl p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-xl text-gray-600">Page not found</p>
        <Link to="/" className="mt-8">
          Go back to the homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
