import * as adminService from '../services/adminService.js';

export const getStats = async (req, res) => {
    try {
        const result = await adminService.getStats();
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const result = await adminService.getUsers(req.query);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const toggleUserActive = async (req, res) => {
    try {
        const result = await adminService.toggleUserActive(req.params.id, req.user._id);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 400).json({ message: error.message });
    }
};

export const getCommissionSummary = async (req, res) => {
    try {
        const result = await adminService.getCommissionSummary();
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};
