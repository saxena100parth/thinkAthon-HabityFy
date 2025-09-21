import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Target, Calendar, Bell, BarChart3, Users, Star } from 'lucide-react';

const Landing = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const features = [
        {
            icon: <Target className="w-8 h-8" />,
            title: "Smart Habit Tracking",
            description: "Track your daily habits with intelligent reminders and progress monitoring."
        },
        {
            icon: <BarChart3 className="w-8 h-8" />,
            title: "Detailed Analytics",
            description: "Get insights into your progress with beautiful charts and statistics."
        },
        {
            icon: <Bell className="w-8 h-8" />,
            title: "Smart Notifications",
            description: "Never miss a habit with personalized reminders and achievement alerts."
        },
        {
            icon: <Calendar className="w-8 h-8" />,
            title: "Streak Tracking",
            description: "Build momentum with streak counters and celebrate your consistency."
        }
    ];

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Product Manager",
            content: "HabityFy helped me build a consistent morning routine. I've never felt more productive!",
            rating: 5
        },
        {
            name: "Mike Chen",
            role: "Software Developer",
            content: "The streak tracking feature is incredibly motivating. I've maintained my reading habit for 60+ days!",
            rating: 5
        },
        {
            name: "Emily Rodriguez",
            role: "Fitness Coach",
            content: "Perfect for tracking fitness habits. The analytics help me understand my patterns better.",
            rating: 5
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <h1 className="text-2xl font-bold text-red-600">HabityFy</h1>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link to="/login" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors">
                                    Login
                                </Link>
                                <Link to="/signup" className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            Build Better
                            <span className="block text-red-600">Habits</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Transform your life one habit at a time with HabityFy. Track, analyze, and celebrate your progress with our intelligent habit management platform.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/signup"
                                className="bg-red-600 text-white hover:bg-red-700 font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                                Start Your Journey
                            </Link>
                            <Link
                                to="/login"
                                className="bg-white text-red-600 hover:bg-red-50 font-semibold py-4 px-8 rounded-lg text-lg border-2 border-red-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`text-center mb-16 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose HabityFy?</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Everything you need to build and maintain healthy habits in one beautiful platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                            >
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-600">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`text-center mb-16 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
                        <p className="text-xl text-gray-600">Join thousands of people who have transformed their lives with HabityFy.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className={`bg-gray-50 p-8 rounded-xl transition-all duration-1000 delay-${(index + 1) * 100} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                            >
                                <div className="flex mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                                <div>
                                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-red-600">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <div className={`transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Ready to Transform Your Life?
                        </h2>
                        <p className="text-xl text-red-100 mb-8">
                            Join thousands of people who are already building better habits with HabityFy.
                        </p>
                        <Link
                            to="/signup"
                            className="bg-white text-red-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                        >
                            Get Started Free
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-red-500 mb-4">HabityFy</h3>
                        <p className="text-gray-400 mb-6">Build better habits, build a better you.</p>
                        <div className="flex justify-center space-x-6">
                            <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
                                Login
                            </Link>
                            <Link to="/signup" className="text-gray-400 hover:text-white transition-colors">
                                Sign Up
                            </Link>
                        </div>
                        <div className="mt-8 pt-8 border-t border-gray-800">
                            <p className="text-gray-400 text-sm">
                                © 2025 HabityFy. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
