import React, { useState } from 'react';
import {
    ArrowLeft,
    Utensils,
    Send,
    Loader2,
    Copy,
    CheckCircle,
    AlertCircle,
    RefreshCw,
    Sparkles
} from 'lucide-react';

const DietChart = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        setError('');
        setResponse('');

        try {
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer sk-fe6e52c2e10c4a78b1191a72382a7f9c`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a professional nutritionist and dietitian. Provide detailed, personalized diet charts and nutritional advice based on user requirements. Include meal plans, portion sizes, nutritional information, and practical tips. Format your response in a clear, structured manner with proper headings and bullet points.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: 100,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setResponse(data.choices[0].message.content);
        } catch (error) {
            console.error('Error calling DeepSeek API:', error);
            setError('Failed to generate diet chart. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(response);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy text:', error);
        }
    };

    const handleClear = () => {
        setPrompt('');
        setResponse('');
        setError('');
    };

    const examplePrompts = [
        "Create a 7-day vegetarian diet plan for weight loss",
        "Design a high-protein diet for muscle building",
        "Suggest a diabetic-friendly meal plan for a week",
        "Create a balanced diet for a 25-year-old office worker",
        "Plan a keto diet menu for beginners"
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center">
                        <button
                            onClick={() => window.location.href = '/dashboard'}
                            className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Back to Dashboard"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <Utensils className="w-8 h-8 text-red-600 mr-3" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Diet Chart Generator</h1>
                            <p className="text-gray-600">Get personalized diet plans powered by DeepSeek AI</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Sparkles className="w-5 h-5 mr-2 text-red-600" />
                            Enter Your Requirements
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                                    Describe your diet requirements
                                </label>
                                <textarea
                                    id="prompt"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="e.g., Create a 7-day vegetarian diet plan for weight loss with 1200 calories per day..."
                                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                                    disabled={loading}
                                />
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    type="submit"
                                    disabled={loading || !prompt.trim()}
                                    className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4 mr-2" />
                                    )}
                                    {loading ? 'Generating...' : 'Generate Diet Chart'}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleClear}
                                    disabled={loading}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            </div>
                        </form>

                        {/* Example Prompts */}
                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Example Prompts:</h3>
                            <div className="space-y-2">
                                {examplePrompts.map((example, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setPrompt(example)}
                                        disabled={loading}
                                        className="w-full text-left p-3 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {example}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Response Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Utensils className="w-5 h-5 mr-2 text-red-600" />
                                Generated Diet Chart
                            </h2>
                            {response && (
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    {copied ? (
                                        <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                                    ) : (
                                        <Copy className="w-4 h-4 mr-1" />
                                    )}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            )}
                        </div>

                        <div className="h-96 overflow-y-auto">
                            {loading && (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-red-600 mx-auto mb-2" />
                                        <p className="text-gray-600">Generating your personalized diet chart...</p>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                                    <p className="text-red-800">{error}</p>
                                </div>
                            )}

                            {response && !loading && (
                                <div className="prose prose-sm max-w-none">
                                    <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                                        {response}
                                    </div>
                                </div>
                            )}

                            {!response && !loading && !error && (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    <div className="text-center">
                                        <Utensils className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p>Your personalized diet chart will appear here</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tips Section */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-blue-900 mb-3">💡 Tips for Better Results</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                        <div>
                            <h4 className="font-medium mb-2">Be Specific:</h4>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Mention your age, gender, and activity level</li>
                                <li>Specify dietary restrictions or preferences</li>
                                <li>Include your health goals (weight loss, muscle gain, etc.)</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Include Details:</h4>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Calorie requirements if known</li>
                                <li>Meal timing preferences</li>
                                <li>Food allergies or intolerances</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DietChart;
