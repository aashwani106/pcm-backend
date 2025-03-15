const User = require('../models/userModel');

const getAllStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' })
            .select('name email phone_no')
            .sort({ name: 1 });
        
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllStudents
}; 