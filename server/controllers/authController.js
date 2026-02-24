import * as authService from '../services/authService.js';

export const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.loginUser(email, password);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const result = await authService.registerUser(name, email, password, role);
        res.status(201).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const logoutUser = (req, res) => {
    res.json({ message: 'Logged out successfully' });
};

export const getUserProfile = async (req, res) => {
    try {
        const result = await authService.getProfile(req.user._id);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const result = await authService.updateProfile(req.user._id, {
            name: req.body.name,
            password: req.body.password,
        });
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};