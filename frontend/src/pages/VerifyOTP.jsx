import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, ArrowLeft, CheckCircle } from 'lucide-react';

const VerifyOTP = () => {
    const navigate = useNavigate();
    const { verifyOTP } = useAuth();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');

    useEffect(() => {
        const signupEmail = localStorage.getItem('signupEmail');
        if (!signupEmail) {
            navigate('/signup');
            return;
        }
        setEmail(signupEmail);
    }, [navigate]);

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return; // Prevent multiple characters

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }

        // Clear errors
        if (errors.otp) {
            setErrors(prev => ({ ...prev, otp: '' }));
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // OTP validation
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            newErrors.otp = 'Please enter the complete 6-digit code';
        } else if (!/^\d{6}$/.test(otpString)) {
            newErrors.otp = 'OTP must contain only numbers';
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }

        // Confirm password validation
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        const result = await verifyOTP({
            email,
            otp: otp.join(''),
            password
        });

        if (result.success) {
            // Clear signup email from storage
            localStorage.removeItem('signupEmail');
            navigate('/dashboard');
        } else {
            setErrors({ general: result.error });
        }

        setIsLoading(false);
    };

    const resendOTP = async () => {
        // This would typically call an API to resend OTP
        console.log('Resending OTP...');
        // For now, just show a message
        alert('OTP resent! Check your email.');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <Link to="/" className="inline-block mb-6">
                        <h1 className="text-3xl font-bold text-red-600">HabityFy</h1>
                    </Link>
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Verify your email</h2>
                    <p className="mt-2 text-gray-600">
                        We've sent a 6-digit code to <span className="font-medium">{email}</span>
                    </p>
                </div>

                <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {errors.general && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                                <p className="text-sm">{errors.general}</p>
                            </div>
                        )}

                        {/* OTP Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                                Enter verification code
                            </label>
                            <div className="flex justify-center space-x-2 mb-4">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className={`w-12 h-12 text-center text-lg font-semibold border ${errors.otp ? 'border-red-300' : 'border-gray-300'
                                            } rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500`}
                                    />
                                ))}
                            </div>
                            {errors.otp && (
                                <p className="text-sm text-red-600 text-center">{errors.otp}</p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Create Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className={`appearance-none block w-full px-3 py-3 border ${errors.password ? 'border-red-300' : 'border-gray-300'
                                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                className={`appearance-none block w-full px-3 py-3 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {errors.confirmPassword && (
                                <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${isLoading
                                    ? 'bg-red-400 cursor-not-allowed'
                                    : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                                    } transition-colors duration-200`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="mr-2 h-5 w-5" />
                                        Complete Setup
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Didn't receive the code?{' '}
                                <button
                                    type="button"
                                    onClick={resendOTP}
                                    className="font-medium text-red-600 hover:text-red-500"
                                >
                                    Resend code
                                </button>
                            </p>
                        </div>

                        <div className="text-center">
                            <Link
                                to="/signup"
                                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to signup
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;
