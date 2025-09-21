import { useState } from 'react';
import { X, Clock, Bell, BellOff } from 'lucide-react';

const HabitForm = ({ onSubmit, onCancel, title = "Create Habit", initialData = null }) => {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        frequency: initialData?.frequency || 'daily',
        timeOfDay: initialData?.timeOfDay || '09:00',
        reminderEnabled: initialData?.reminderEnabled ?? true,
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Habit title is required';
        } else if (formData.title.length > 100) {
            newErrors.title = 'Title must be less than 100 characters';
        }

        if (formData.description && formData.description.length > 500) {
            newErrors.description = 'Description must be less than 500 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const result = await onSubmit(formData);
        if (result?.success) {
            // Form will be closed by parent component
        } else if (result?.error) {
            setErrors({ general: result.error });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <button
                    onClick={onCancel}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                        <p className="text-sm">{errors.general}</p>
                    </div>
                )}

                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Habit Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${errors.title ? 'border-red-300' : 'border-gray-300'
                            }`}
                        placeholder="e.g., Morning Exercise, Read Books, Meditate"
                        maxLength={100}
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description (Optional)
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${errors.description ? 'border-red-300' : 'border-gray-300'
                            }`}
                        placeholder="Add a description to help you remember why this habit is important..."
                        maxLength={500}
                    />
                    <div className="mt-1 flex justify-between text-xs text-gray-500">
                        <span>{errors.description && <span className="text-red-600">{errors.description}</span>}</span>
                        <span>{formData.description.length}/500</span>
                    </div>
                </div>

                {/* Frequency */}
                <div>
                    <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
                        Frequency
                    </label>
                    <select
                        id="frequency"
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="custom">Custom</option>
                    </select>
                </div>

                {/* Time of Day */}
                <div>
                    <label htmlFor="timeOfDay" className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Time of Day
                    </label>
                    <input
                        type="time"
                        id="timeOfDay"
                        name="timeOfDay"
                        value={formData.timeOfDay}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                </div>

                {/* Reminder Toggle */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <label htmlFor="reminderEnabled" className="block text-sm font-medium text-gray-700">
                            <Bell className="w-4 h-4 inline mr-1" />
                            Enable Reminders
                        </label>
                    </div>
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, reminderEnabled: !prev.reminderEnabled }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.reminderEnabled ? 'bg-red-600' : 'bg-gray-200'
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.reminderEnabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                        />
                    </button>
                </div>

                {/* Reminder Info */}
                {formData.reminderEnabled && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-start">
                            <Bell className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                            <div className="text-sm text-blue-800">
                                <p className="font-medium">Reminder enabled</p>
                                <p className="text-blue-600">
                                    You'll receive notifications at {formData.timeOfDay} to help you stay consistent.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                        {initialData ? 'Update Habit' : 'Create Habit'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default HabitForm;
