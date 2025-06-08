// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full text-center py-10">
        <AlertTriangle size={64} className="mx-auto text-yellow-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button>
            <Home size={16} className="mr-2" />
            Back to Home
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default NotFound;
