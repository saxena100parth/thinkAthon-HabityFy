import { useState, useEffect } from 'react';
import { X, Clock, Target, Tag, Star, Plus, Minus } from 'lucide-react';

const HabitCreationForm = ({ masterHabit, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: masterHabit?.title || '',
        description: masterHabit?.description || '',
        frequency: masterHabit?.suggestedFrequency || 'daily',
        timeOfDay: [masterHabit?.suggestedTimeOfDay || '09:00'],
        primaryTime: masterHabit?.suggestedTimeOfDay || '09:00',
        duration: masterHabit?.suggestedDuration || '15 min',
        customDuration: null,
        targetValue: null,
        unit: '',
        reminderEnabled: true,
        reminderTimes: [masterHabit?.suggestedTimeOfDay || '09:00'],
        priority: 'medium',
        tags: []
    });

    const [customTag, setCustomTag] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        if (masterHabit) {
            setFormData(prev => ({
                ...prev,
                title: masterHabit.title,
                description: masterHabit.description,
                frequency: masterHabit.suggestedFrequency,
                timeOfDay: [masterHabit.suggestedTimeOfDay],
                primaryTime: masterHabit.suggestedTimeOfDay,
                duration: masterHabit.suggestedDuration,
                reminderTimes: [masterHabit.suggestedTimeOfDay]
            }));
        }
    }, [masterHabit]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear errors when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }

        // Clear submit error when user makes changes
        if (submitError) {
            setSubmitError('');
        }
    };

    const handleTimeAdd = () => {
        const newTime = '09:00';
        setFormData(prev => ({
            ...prev,
            timeOfDay: [...prev.timeOfDay, newTime],
            reminderTimes: [...prev.reminderTimes, newTime]
        }));
    };

    const handleTimeRemove = (index) => {
        if (formData.timeOfDay.length > 1) {
            setFormData(prev => ({
                ...prev,
                timeOfDay: prev.timeOfDay.filter((_, i) => i !== index),
                reminderTimes: prev.reminderTimes.filter((_, i) => i !== index)
            }));
        }
    };

    const handleTimeChange = (index, value) => {
        setFormData(prev => ({
            ...prev,
            timeOfDay: prev.timeOfDay.map((time, i) => i === index ? value : time),
            reminderTimes: prev.reminderTimes.map((time, i) => i === index ? value : time)
        }));
    };

    const handleTagAdd = () => {
        if (customTag.trim() && !formData.tags.includes(customTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, customTag.trim()]
            }));
            setCustomTag('');
        }
    };

    const handleTagRemove = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (formData.timeOfDay.some(time => !time)) {
            newErrors.timeOfDay = 'All times must be valid';
        }

        if (formData.customDuration && (formData.customDuration < 1 || formData.customDuration > 1440)) {
            newErrors.customDuration = 'Duration must be between 1 and 1440 minutes';
        }

        if (formData.targetValue && formData.targetValue < 1) {
            newErrors.targetValue = 'Target value must be at least 1';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        const habitData = {
            masterHabitId: masterHabit._id,
            ...formData,
            // Clean up empty values
            customDuration: formData.customDuration || undefined,
            targetValue: formData.targetValue || undefined,
            unit: formData.unit || undefined,
        };

        try {
            const result = await onSubmit(habitData);
            if (result && !result.success) {
                setSubmitError(result.error || 'Failed to create habit');
            }
            // The parent component will handle closing the modal based on the result
        } catch (error) {
            console.error('Error creating habit:', error);
            setSubmitError('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: 'text-green-600 bg-green-100',
            medium: 'text-yellow-600 bg-yellow-100',
            high: 'text-red-600 bg-red-100'
        };
        return colors[priority] || colors.medium;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Customize Your Habit</h2>
                            <p className="text-gray-600">Personalize your habit to fit your lifestyle</p>
                        </div>
                        <button
                            onClick={onCancel}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Target className="w-5 h-5 mr-2" />
                                Basic Information
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Habit Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${errors.title ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter habit title"
                                />
                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    placeholder="Describe your habit"
                                />
                            </div>
                        </div>

                        {/* Frequency and Timing */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Clock className="w-5 h-5 mr-2" />
                                Frequency & Timing
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Frequency
                                    </label>
                                    <select
                                        value={formData.frequency}
                                        onChange={(e) => handleInputChange('frequency', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="custom">Custom</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Priority
                                    </label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => handleInputChange('priority', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>

                            {/* Times of Day */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Times of Day
                                </label>
                                <div className="space-y-2">
                                    {formData.timeOfDay.map((time, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <input
                                                type="time"
                                                value={time}
                                                onChange={(e) => handleTimeChange(index, e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            />
                                            {formData.timeOfDay.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleTimeRemove(index)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={handleTimeAdd}
                                        className="flex items-center text-red-600 hover:text-red-700 text-sm"
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add another time
                                    </button>
                                </div>
                                {errors.timeOfDay && <p className="text-red-500 text-sm mt-1">{errors.timeOfDay}</p>}
                            </div>
                        </div>

                        {/* Duration and Targets */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Duration & Targets</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Duration
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.duration}
                                        onChange={(e) => handleInputChange('duration', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        placeholder="e.g., 15 min, 30 min, 1 hour"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Custom Duration (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.customDuration || ''}
                                        onChange={(e) => handleInputChange('customDuration', parseInt(e.target.value) || null)}
                                        min="1"
                                        max="1440"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        placeholder="e.g., 30"
                                    />
                                    {errors.customDuration && <p className="text-red-500 text-sm mt-1">{errors.customDuration}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Target Value
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.targetValue || ''}
                                        onChange={(e) => handleInputChange('targetValue', parseInt(e.target.value) || null)}
                                        min="1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        placeholder="e.g., 8 (for 8 glasses of water)"
                                    />
                                    {errors.targetValue && <p className="text-red-500 text-sm mt-1">{errors.targetValue}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Unit
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.unit}
                                        onChange={(e) => handleInputChange('unit', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        placeholder="e.g., glasses, steps, pages"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Tag className="w-5 h-5 mr-2" />
                                Tags
                            </h3>

                            <div className="flex flex-wrap gap-2 mb-2">
                                {formData.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleTagRemove(tag)}
                                            className="ml-2 text-red-600 hover:text-red-800"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>

                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={customTag}
                                    onChange={(e) => setCustomTag(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    placeholder="Add a tag"
                                />
                                <button
                                    type="button"
                                    onClick={handleTagAdd}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* Reminders */}
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="reminderEnabled"
                                    checked={formData.reminderEnabled}
                                    onChange={(e) => handleInputChange('reminderEnabled', e.target.checked)}
                                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                />
                                <label htmlFor="reminderEnabled" className="ml-2 text-sm font-medium text-gray-700">
                                    Enable reminders
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Error Display */}
                    {submitError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{submitError}</p>
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-6 py-2 rounded-lg flex items-center ${isSubmitting
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    : 'bg-red-600 text-white hover:bg-red-700'
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Star className="w-4 h-4 mr-2" />
                                    Create Habit
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HabitCreationForm;
