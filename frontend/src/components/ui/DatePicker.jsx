import React, { useState } from 'react';

const DatePicker = ({
    selectedDate,
    onDateChange,
    className = '',
    showTodayButton = true,
    showTomorrowButton = true,
    showYesterdayButton = true,
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const formatDate = (date) => {
        if (!date) return 'Select Date';
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isToday = (date) => {
        if (!date) return false;
        const today = new Date().toISOString().split('T')[0];
        return date === today;
    };

    const isTomorrow = (date) => {
        if (!date) return false;
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return date === tomorrow.toISOString().split('T')[0];
    };

    const isYesterday = (date) => {
        if (!date) return false;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return date === yesterday.toISOString().split('T')[0];
    };

    const handleDateSelect = (date) => {
        onDateChange(date);
        setIsOpen(false);
    };

    const handleQuickSelect = (type) => {
        const today = new Date();
        let targetDate;

        switch (type) {
            case 'today':
                targetDate = today.toISOString().split('T')[0];
                break;
            case 'tomorrow':
                today.setDate(today.getDate() + 1);
                targetDate = today.toISOString().split('T')[0];
                break;
            case 'yesterday':
                today.setDate(today.getDate() - 1);
                targetDate = today.toISOString().split('T')[0];
                break;
            default:
                return;
        }

        handleDateSelect(targetDate);
    };

    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 365); // Allow up to 1 year in future
        return maxDate.toISOString().split('T')[0];
    };

    const getMinDate = () => {
        const minDate = new Date();
        minDate.setDate(minDate.getDate() - 365); // Allow up to 1 year in past
        return minDate.toISOString().split('T')[0];
    };

    return (
        <div className={`relative ${className}`}>
            {/* Date Picker Button */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`
                    w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-red-300'}
                    ${isToday(selectedDate) ? 'bg-red-50 border-red-300 text-red-700' : ''}
                    ${isTomorrow(selectedDate) ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}
                    ${isYesterday(selectedDate) ? 'bg-gray-50 border-gray-400 text-gray-700' : ''}
                `}
            >
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                        {formatDate(selectedDate)}
                    </span>
                    <svg
                        className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    {/* Quick Select Buttons */}
                    <div className="p-3 border-b border-gray-200">
                        <div className="flex space-x-2">
                            {showYesterdayButton && (
                                <button
                                    onClick={() => handleQuickSelect('yesterday')}
                                    className={`
                                        px-3 py-1 text-xs rounded-md transition-colors
                                        ${isYesterday(selectedDate)
                                            ? 'bg-gray-100 text-gray-700'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }
                                    `}
                                >
                                    Yesterday
                                </button>
                            )}
                            {showTodayButton && (
                                <button
                                    onClick={() => handleQuickSelect('today')}
                                    className={`
                                        px-3 py-1 text-xs rounded-md transition-colors
                                        ${isToday(selectedDate)
                                            ? 'bg-red-100 text-red-700'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }
                                    `}
                                >
                                    Today
                                </button>
                            )}
                            {showTomorrowButton && (
                                <button
                                    onClick={() => handleQuickSelect('tomorrow')}
                                    className={`
                                        px-3 py-1 text-xs rounded-md transition-colors
                                        ${isTomorrow(selectedDate)
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }
                                    `}
                                >
                                    Tomorrow
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Date Input */}
                    <div className="p-3">
                        <input
                            type="date"
                            value={selectedDate || ''}
                            onChange={(e) => handleDateSelect(e.target.value)}
                            min={getMinDate()}
                            max={getMaxDate()}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                    </div>

                    {/* Close Button */}
                    <div className="p-3 border-t border-gray-200">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Overlay to close dropdown */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default DatePicker;
