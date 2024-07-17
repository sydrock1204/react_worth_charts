// components/DynamicLoadingIndicator.js

import React from 'react';

const DynamicLoadingIndicator = ({ isLoading }) => {
    return (
        isLoading && (
            <div className="fixed top-0 left-0 z-50 w-screen h-screen flex items-center justify-center bg-gray-900 bg-opacity-50">
                <div className="animate-pulse rounded-full h-20 w-20 border-4 border-gray-300"></div>
            </div>
        )
    );
};

export default DynamicLoadingIndicator;
