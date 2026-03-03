import * as vendorService from '../services/vendorService.js';

export const getVendorDashboard = async (req, res) => {
    try {
        const result = await vendorService.getDashboard(req.user._id);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const getVendorSales = async (req, res) => {
    try {
        const result = await vendorService.getVendorSales(req.user._id);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const getVendors = async (req, res) => {
    try {
        const result = await vendorService.getVendors();
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const getVendorProfile = async (req, res) => {
    try {
        const result = await vendorService.getVendorProfile(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};
