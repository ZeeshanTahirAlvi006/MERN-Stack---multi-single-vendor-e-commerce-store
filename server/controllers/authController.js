import User from '../models/User.js';
import { generateJWTToken } from '../utils/jwtUtils.js';

//authenticate user
export const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.comparePassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateJWTToken(user._id, user.role),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

//register controller
export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        name,
        email,
        password,
        role: role || 'customer'
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateJWTToken(user._id, user.role),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

//logout controller
export const logoutUser = (req, res) => {
    res.json({ message: 'Logged out successfully' });
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            storeInfo: user.storeInfo,
            isActive: user.isActive,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile (name/password)
// @route   PUT /api/auth/profile
export const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;

    if (req.body.password) {
        user.password = req.body.password; // pre-save hook hashes it
    }

    const updatedUser = await user.save();

    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateJWTToken(updatedUser._id, updatedUser.role),
    });
};