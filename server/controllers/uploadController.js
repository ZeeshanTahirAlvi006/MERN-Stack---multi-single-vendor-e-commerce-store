import * as uploadService from '../services/uploadService.js';

export const getUploadCredentials = async (req, res) => {
    try {
        const result = uploadService.getUploadCredentials(req.user._id);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};
