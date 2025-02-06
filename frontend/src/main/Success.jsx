import React from 'react';

const Success = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
                <p className="text-gray-700 mb-6">Thank you for your purchase. Your transaction was successful.</p>
                <a href="/" className="text-blue-500 hover:underline">Go back to Home</a>
            </div>
        </div>
    );
};

export default Success;
