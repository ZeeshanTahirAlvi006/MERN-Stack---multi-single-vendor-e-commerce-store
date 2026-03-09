import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../api/api';
import { toast } from 'react-toastify';
import {
  FiPackage,
  FiDollarSign,
  FiImage,
  FiLayers,
  FiHash,
  FiArrowLeft,
  FiPlus,
  FiX,
  FiUploadCloud,
} from 'react-icons/fi';

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Sports'];

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dl7ws1viu/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'E-Commerce-App';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.stock && formData.stock !== 0) newErrors.stock = 'Stock quantity is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (images.length === 0) newErrors.images = 'At least one image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (images.length + files.length > 3) {
      return toast.error('You can only upload a maximum of 3 images');
    }

    // New Strict File Validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB limit
    
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return toast.error(`Invalid file type: ${file.name}. Only JPG, PNG, and WEBP allowed.`);
      }
      if (file.size > maxSize) {
        return toast.error(`File too large: ${file.name}. Maximum size is 5MB.`);
      }
    }

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: data });
        const json = await res.json();
        return json.secure_url;
      });

      const urls = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...urls]);
      if (errors.images) setErrors({ ...errors, images: '' });
      toast.success(`${urls.length} image(s) uploaded!`);
    } catch {
      toast.error('Image upload failed. Check your Cloudinary config.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await createProduct({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images,
      });
      toast.success('Product created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const inputWrapperBase =
    'flex items-center bg-white border-[1.5px] rounded-xl px-4 h-12 transition-all duration-200';
  const inputWrapperNormal =
    'border-gray-200 focus-within:border-[var(--accent)] focus-within:ring-3 focus-within:ring-[var(--accent)]/10';
  const inputWrapperError =
    'border-red-500 focus-within:ring-3 focus-within:ring-red-500/10';
  const inputClasses =
    'flex-1 border-none outline-none bg-transparent text-[0.925rem] text-gray-900 placeholder:text-gray-300 h-full font-[inherit]';

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      {/* Form */}
      <div className="flex-1 max-w-3xl mx-auto px-6 py-8 w-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Product Name
            </label>
            <div className={`${inputWrapperBase} ${errors.name ? inputWrapperError : inputWrapperNormal}`}>
              <FiPackage className="text-gray-400 text-lg shrink-0 mr-3" />
              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Wireless Bluetooth Headphones"
                value={formData.name}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            {errors.name && <span className="block text-red-500 text-xs mt-1 font-medium">{errors.name}</span>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Describe your product in detail..."
              value={formData.description}
              onChange={handleChange}
              className={`w-full bg-white border-[1.5px] rounded-xl px-4 py-3 text-[0.925rem] text-gray-900 placeholder:text-gray-300 font-[inherit] outline-none transition-all duration-200 resize-none
                ${errors.description
                  ? 'border-red-500 focus:ring-3 focus:ring-red-500/10'
                  : 'border-gray-200 focus:border-[var(--accent)] focus:ring-3 focus:ring-[var(--accent)]/10'}`}
            />
            {errors.description && <span className="block text-red-500 text-xs mt-1 font-medium">{errors.description}</span>}
          </div>

          {/* Price & Stock (side by side) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Price (PKR)
              </label>
              <div className={`${inputWrapperBase} ${errors.price ? inputWrapperError : inputWrapperNormal}`}>
                <FiDollarSign className="text-gray-400 text-lg shrink-0 mr-3" />
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              {errors.price && <span className="block text-red-500 text-xs mt-1 font-medium">{errors.price}</span>}
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Stock Quantity
              </label>
              <div className={`${inputWrapperBase} ${errors.stock ? inputWrapperError : inputWrapperNormal}`}>
                <FiHash className="text-gray-400 text-lg shrink-0 mr-3" />
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>
              {errors.stock && <span className="block text-red-500 text-xs mt-1 font-medium">{errors.stock}</span>}
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Category
            </label>
            <div className={`${inputWrapperBase} ${errors.category ? inputWrapperError : inputWrapperNormal}`}>
              <FiLayers className="text-gray-400 text-lg shrink-0 mr-3" />
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`${inputClasses} cursor-pointer`}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            {errors.category && <span className="block text-red-500 text-xs mt-1 font-medium">{errors.category}</span>}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Product Images
            </label>
            <div className={`border-[1.5px] border-dashed rounded-xl p-6 text-center transition-all duration-200
              ${errors.images ? 'border-red-500 bg-red-50/50' : 'border-gray-300 bg-white hover:border-[var(--accent)] hover:bg-[var(--accent-hover)]/30'}`}>
              <FiImage className="mx-auto text-3xl text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-3">Drag & drop or click to upload</p>
              <label className={`inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors ${images.length >= 3 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[var(--accent)] hover:bg-[var(--accent)]'}`}>
                <FiUploadCloud />
                {uploading ? 'Uploading...' : 'Choose Files'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploading || images.length >= 3}
                  className="hidden"
                />
              </label>
              {images.length >= 3 && <p className="text-xs text-amber-600 mt-2 font-medium">Maximum limit of 3 images reached.</p>}
            </div>
            {errors.images && <span className="block text-red-500 text-xs mt-1 font-medium">{errors.images}</span>}

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {images.map((url, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group">
                    <img src={url} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity border-none cursor-pointer"
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || uploading}
            className="flex items-center justify-center gap-2 w-full h-12 bg-gradient-to-br from-[var(--accent)] to-[var(--accent)] text-white rounded-xl text-[0.95rem] font-semibold cursor-pointer transition-all duration-300 mt-2 hover:not-disabled:shadow-lg hover:not-disabled:shadow-[var(--accent)]/35 hover:not-disabled:-translate-y-0.5 active:not-disabled:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-5.5 h-5.5 border-[2.5px] border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <FiPlus /> Publish Product
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
