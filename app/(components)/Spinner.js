import React from 'react';

const LoadingSpinner = () => (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="spinner"></div>
    </div>
);

LoadingSpinner.displayName = 'Spinner';

export default LoadingSpinner;
