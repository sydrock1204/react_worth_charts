import React from 'react';
import useWindowWidth from '../../context/useScreenWidth'

const DynamicLoadingIndicator = ({ isLoading }) => {
    const width = useWindowWidth()
    return (
        isLoading && (
            <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50">
                <div className={`absolute ${width > 767 ? "top-1/2 left-1/2" : "top-1/4 left-1/3" }  transform -translate-x-1/2`}>
                    <div className="animate-pulse rounded-full h-20 w-20 border-4 border-gray-300"></div>
                </div>
            </div>
        )
    );
};

export default DynamicLoadingIndicator;
