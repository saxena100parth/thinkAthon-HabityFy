const MasterHabit = require('../models/MasterHabit');

// @desc    Get all master habits
// @route   GET /api/master-habits
// @access  Public
const getMasterHabits = async (req, res) => {
    try {
        const { category, search } = req.query;

        let habits;
        if (search) {
            habits = await MasterHabit.searchHabits(search, category);
        } else if (category) {
            habits = await MasterHabit.getByCategory(category);
        } else {
            habits = await MasterHabit.find({ isActive: true }).sort({ sortOrder: 1, title: 1 });
        }

        res.json({
            success: true,
            count: habits.length,
            habits
        });
    } catch (error) {
        console.error('Get master habits error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching master habits'
        });
    }
};

// @desc    Get master habits by category
// @route   GET /api/master-habits/categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        const categories = await MasterHabit.getCategories();

        const categoryData = categories.map(category => ({
            key: category,
            name: category.split('_').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' & '),
            icon: getCategoryIcon(category),
            emoji: getCategoryEmoji(category)
        }));

        res.json({
            success: true,
            categories: categoryData
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching categories'
        });
    }
};

// @desc    Get single master habit
// @route   GET /api/master-habits/:id
// @access  Public
const getMasterHabit = async (req, res) => {
    try {
        const habit = await MasterHabit.findById(req.params.id);

        if (!habit) {
            return res.status(404).json({
                success: false,
                message: 'Master habit not found'
            });
        }

        res.json({
            success: true,
            habit
        });
    } catch (error) {
        console.error('Get master habit error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching master habit'
        });
    }
};

// Helper function to get category icon
function getCategoryIcon(category) {
    const icons = {
        'health_fitness': '💪',
        'mental_wellbeing': '🧠',
        'learning_growth': '📚',
        'productivity_career': '💼',
        'lifestyle_relationships': '🏡'
    };
    return icons[category] || '📋';
}

// Helper function to get category emoji
function getCategoryEmoji(category) {
    const emojis = {
        'health_fitness': '💪',
        'mental_wellbeing': '🧠',
        'learning_growth': '📚',
        'productivity_career': '💼',
        'lifestyle_relationships': '🏡'
    };
    return emojis[category] || '📋';
}

module.exports = {
    getMasterHabits,
    getCategories,
    getMasterHabit
};
