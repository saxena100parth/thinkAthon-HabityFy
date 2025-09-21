import React from 'react';

const TestPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-red-600 mb-4">Test Page</h1>
                <p className="text-gray-600">This is a simple test page to check if React is working.</p>
                <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
};

export default TestPage;
