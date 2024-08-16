import React from "react";

const LoadingSpinner = () => (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-white bg-opacity-70">
    <div className="spinner"></div>
  </div>
);

LoadingSpinner.displayName = "Spinner";

export default LoadingSpinner;
