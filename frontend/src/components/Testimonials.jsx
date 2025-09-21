import { useState, useEffect } from 'react';

const Testimonials = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        const element = document.getElementById('testimonials');
        if (element) {
            observer.observe(element);
        }

        return () => observer.disconnect();
    }, []);

    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Product Manager",
            company: "TechCorp",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
            content: "TrackIt has completely transformed how I manage my daily goals. The analytics are incredible and the interface is so intuitive. I've achieved more in 3 months than I did in the previous year!",
            rating: 5
        },
        {
            name: "Michael Chen",
            role: "Entrepreneur",
            company: "StartupXYZ",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
            content: "The real-time sync across all my devices is a game-changer. I can track my habits on my phone and review detailed reports on my laptop. It's like having a personal coach!",
            rating: 5
        },
        {
            name: "Emily Rodriguez",
            role: "Fitness Coach",
            company: "FitLife",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            content: "I recommend TrackIt to all my clients. The goal-setting features and progress tracking help them stay motivated and see real results. It's the perfect tool for anyone serious about self-improvement.",
            rating: 5
        }
    ];

    return (
        <section id="testimonials" className="section-padding bg-white">
            <div className="container-custom">
                <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        What Our Users Say
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Don't just take our word for it. Here's what real users have to say about their experience with TrackIt.
                    </p>
                </div>

                {/* Main Testimonial */}
                <div className={`max-w-4xl mx-auto mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full translate-y-12 -translate-x-12"></div>

                        <div className="relative z-10">
                            <div className="flex justify-center mb-6">
                                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                                    <svg key={i} className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <blockquote className="text-xl md:text-2xl font-medium mb-8 leading-relaxed">
                                "{testimonials[currentTestimonial].content}"
                            </blockquote>
                            <div className="flex items-center justify-center space-x-4">
                                <img
                                    src={testimonials[currentTestimonial].image}
                                    alt={testimonials[currentTestimonial].name}
                                    className="w-16 h-16 rounded-full object-cover border-4 border-white"
                                />
                                <div className="text-left">
                                    <div className="font-semibold text-lg">{testimonials[currentTestimonial].name}</div>
                                    <div className="text-red-100">
                                        {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Testimonial Cards Grid */}
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className={`card p-6 text-center group cursor-pointer transition-all duration-300 ${index === currentTestimonial
                                    ? 'ring-2 ring-red-600 shadow-xl'
                                    : 'hover:shadow-lg'
                                }`}
                            onClick={() => setCurrentTestimonial(index)}
                        >
                            <div className="flex justify-center mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                "{testimonial.content.length > 100
                                    ? testimonial.content.substring(0, 100) + '...'
                                    : testimonial.content}"
                            </p>
                            <div className="flex items-center justify-center space-x-3">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="text-left">
                                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                    <div className="text-sm text-gray-500">
                                        {testimonial.role}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Testimonial Indicators */}
                <div className={`flex justify-center space-x-2 mt-8 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentTestimonial(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentTestimonial
                                    ? 'bg-red-600 w-8'
                                    : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;

