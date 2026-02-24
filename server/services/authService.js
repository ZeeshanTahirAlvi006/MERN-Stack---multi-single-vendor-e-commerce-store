import User from '../models/User.js';
import { generateJWTToken } from '../utils/jwtUtils.js';

export const loginUser = async (email, password) => {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateJWTToken(user._id, user.role),
    };
};

export const registerUser = async (name, email, password, role) => {
    const userExists = await User.findOne({ email });

    if (userExists) {
        const error = new Error('User already exists');
        error.statusCode = 400;
        throw error;
    }

    const user = await User.create({
        name,
        email,
        password,
        role: role || 'customer',
    });

    if (!user) {
        const error = new Error('Invalid user data');
        error.statusCode = 400;
        throw error;
    }

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateJWTToken(user._id, user.role),
    };
};

export const getProfile = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        storeInfo: user.storeInfo,
        isActive: user.isActive,
    };
};

export const updateProfile = async (userId, { name, password }) => {
    const user = await User.findById(userId).select('+password');

    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    user.name = name || user.name;
    if (password) {
        user.password = password;
    }

    const updatedUser = await user.save();

    return {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateJWTToken(updatedUser._id, updatedUser.role),
    };
};
