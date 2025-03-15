const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

 
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

 
const registerUser = async (req, res) => {
    console.log('data',req.body);
    try {
        const { name, phone_no, email, p_words, role, dob } = req.body;

        // Check if user exists with email or phone
        const userExists = await User.findOne({ 
            $or: [
                { email },
                { phone_no }
            ]
        });

        if (userExists) {
            return res.status(400).json({ 
                message: 'User already exists with this email or phone number' 
            });
        }

        // Create user
        const user = await User.create({
            name,
            phone_no,
            email,
            p_words,
            role,
            dob: new Date(dob)
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                phone_no: user.phone_no,
                email: user.email,
                role: user.role,
                dob: user.dob,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

 
const loginUser = async (req, res) => {
    console.log('heree ??? ')
    try {
        const { email, p_words } = req.body;

        // Check for user email
        const user = await User.findOne({ email }).select('+p_words');

        if (user && (await user.matchPassword(p_words))) {
            res.json({
                _id: user._id,
                name: user.name,
                phone_no: user.phone_no,
                email: user.email,
                role: user.role,
                dob: user.dob,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser
}; 