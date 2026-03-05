import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProductById, updateProduct } from '../../api/api';
import { FiSave, FiImage, FiUploadCloud, FiX } from 'react-icons/fi';
import Loader from '../../components/common/Loader';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const categories = ['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Sports'];

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const res = await getProductById(id);
      const product = res.data;
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
      });
      setExistingImages(product.images || []);
    } catch (error) {
      toast.error('Failed to load product details');
      navigate('/vendor/products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);

    const urls = files.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls((prev) => [...prev, ...urls]);
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => {
      const newUrls = [...prev];
      URL.revokeObjectURL(newUrls[index]);
      newUrls.splice(index, 1);
      return newUrls;
    });
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (existingImages.length === 0 && newImages.length === 0) {
      return toast.error('At least one image is required');
    }

    setSaving(true);
    try {
      let uploadedUrls = [];
      if (newImages.length > 0) {
        const uploadPromises = newImages.map(async (file) => {
          const data = new FormData();
          data.append('file', file);
          data.append('upload_preset', 'E-Commerce-App'); // Replace with your preset if different
          const res = await fetch('https://api.cloudinary.com/v1_1/dl7ws1viu/image/upload', {
            method: 'POST',
            body: data,
          });
          const json = await res.json();
          return json.secure_url;
        });
        uploadedUrls = await Promise.all(uploadPromises);
      }

      const finalImages = [...existingImages, ...uploadedUrls];

      await updateProduct(id, {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images: finalImages,
      });

      toast.success('Product updated successfully!');
      navigate('/vendor/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-24">
        <Loader className="w-8 h-8 text-blue-800" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Edit Product</h1>
          <p className="text-slate-500 text-sm">Update your product details and inventory.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-800/10 transition-all"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-4 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-800/10 transition-all resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Price (PKR)</label>
              <input
                type="number"
                name="price"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-800/10 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-800/10 transition-all"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-800/10 appearance-none bg-white cursor-pointer transition-all"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Product Images</label>
              
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2 block">Current Images</span>
                  <div className="flex flex-wrap gap-4">
                    {existingImages.map((imgUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imgUrl.startsWith('http') ? imgUrl : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${imgUrl}`}
                          alt="product"
                          className="w-24 h-24 object-cover rounded-xl border border-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity active:scale-95"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images */}
              {imagePreviewUrls.length > 0 && (
                <div className="mb-4">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2 block">New Uploads</span>
                  <div className="flex flex-wrap gap-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt="preview"
                          className="w-24 h-24 object-cover rounded-xl border-dashed border-2 border-blue-400"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity active:scale-95"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="relative mt-2">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-full h-32 border-2 border-dashed border-slate-200 hover:border-blue-800 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-blue-800 transition-colors bg-slate-50 group">
                  <FiUploadCloud className="w-8 h-8 mb-2 group-hover:-translate-y-1 transition-transform" />
                  <span className="text-sm font-medium">Click or drag new images to upload</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/vendor/products')}
              className="flex-1 h-12 bg-slate-100 text-slate-700 rounded-full font-semibold hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 h-12 bg-blue-800 text-white rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-blue-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {saving ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FiSave /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
