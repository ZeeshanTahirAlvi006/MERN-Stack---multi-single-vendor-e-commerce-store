export const getUploadCredentials = (userId) => {
    return {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
        folder: `ecommerce/products/${userId}`,
    };
};
