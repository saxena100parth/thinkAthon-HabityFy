import { useState, useEffect } from 'react';

const About = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        const element = document.getElementById('about');
        if (element) {
            observer.observe(element);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section id="about" className="section-padding bg-gray-50">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Why Choose TrackIt?
                        </h2>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            We believe that tracking your progress shouldn't be complicated. Our platform
                            combines powerful analytics with an intuitive interface to help you achieve
                            your goals faster than ever before.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Simple & Intuitive</h3>
                                    <p className="text-gray-600">Get started in minutes with our user-friendly interface designed for everyone.</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Data-Driven Insights</h3>
                                    <p className="text-gray-600">Make informed decisions with comprehensive analytics and detailed reports.</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Always Available</h3>
                                    <p className="text-gray-600">Access your data anywhere, anytime with our cloud-synced platform.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button className="btn-primary mr-4">
                                Learn More
                            </button>
                            <button className="btn-secondary">
                                View Pricing
                            </button>
                        </div>
                    </div>

                    {/* Image/Visual */}
                    <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                        <div className="relative">
                            {/* Main Card */}
                            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                                <div className="space-y-6">
                                    {/* Header */}
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-semibold text-gray-900">Dashboard Overview</h3>
                                        <div className="flex space-x-2">
                                            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-primary-50 rounded-lg p-4">
                                            <div className="text-2xl font-bold text-red-600">85%</div>
                                            <div className="text-sm text-gray-600">Goal Progress</div>
                                        </div>
                                        <div className="bg-accent-50 rounded-lg p-4">
                                            <div className="text-2xl font-bold text-green-500">42</div>
                                            <div className="text-sm text-gray-600">Days Streak</div>
                                        </div>
                                    </div>

                                    {/* Chart Placeholder */}
                                    <div className="bg-gray-50 rounded-lg p-4 h-32 flex items-center justify-center">
                                        <div className="text-gray-400 text-sm">📊 Analytics Chart</div>
                                    </div>

                                    {/* Recent Activity */}
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3">Recent Activity</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-3 text-sm">
                                                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                                <span className="text-gray-600">Completed daily workout</span>
                                            </div>
                                            <div className="flex items-center space-x-3 text-sm">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span className="text-gray-600">Logged 8 hours of sleep</span>
                                            </div>
                                            <div className="flex items-center space-x-3 text-sm">
                                                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                                <span className="text-gray-600">Read for 30 minutes</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute -top-4 -right-4 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg animate-bounce-slow">
                                ✓
                            </div>
                            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold animate-bounce-slow animation-delay-2000">
                                📈
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;

