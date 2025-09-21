import { useState, useEffect } from 'react';

const CTA = () => {
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

        const element = document.getElementById('cta');
        if (element) {
            observer.observe(element);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section id="cta" className="section-padding bg-gradient-to-br from-red-600 to-red-800 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-bounce-slow"></div>
                <div className="absolute top-20 right-20 w-24 h-24 bg-white rounded-full animate-bounce-slow animation-delay-2000"></div>
                <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-white rounded-full animate-bounce-slow animation-delay-4000"></div>
                <div className="absolute bottom-20 right-1/3 w-16 h-16 bg-white rounded-full animate-bounce-slow animation-delay-1000"></div>
            </div>

            <div className="container-custom relative z-10">
                <div className={`text-center text-white transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                        Ready to Transform
                        <span className="block text-green-300">Your Life?</span>
                    </h2>
                    <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-90 leading-relaxed">
                        Join thousands of successful people who are already tracking their way to greatness.
                        Start your journey today and see the difference tracking can make.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                        <button className="bg-white text-red-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                            Start Free Trial
                        </button>
                        <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-600 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105">
                            View Pricing
                        </button>
                    </div>

                    {/* Features Highlight */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">30-Day Free Trial</h3>
                            <p className="opacity-90">No credit card required. Full access to all features.</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Setup in 5 Minutes</h3>
                            <p className="opacity-90">Get started quickly with our intuitive onboarding.</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Cancel Anytime</h3>
                            <p className="opacity-90">No long-term commitments. Cancel whenever you want.</p>
                        </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className={`mt-16 pt-8 border-t border-white border-opacity-20 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <p className="text-lg mb-6 opacity-90">Trusted by over 10,000 users worldwide</p>
                        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                            <div className="text-2xl font-bold">TechCrunch</div>
                            <div className="text-2xl font-bold">Forbes</div>
                            <div className="text-2xl font-bold">Wired</div>
                            <div className="text-2xl font-bold">The Verge</div>
                            <div className="text-2xl font-bold">Mashable</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;

