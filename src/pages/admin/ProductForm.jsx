import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Save, ArrowLeft, Upload, Trash2 } from 'lucide-react';

const ProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditing);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Mobile',
        image: '',
        stock: 10
    });

    const [specs, setSpecs] = useState([]);
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const categories = ['Mobile', 'Laptop', 'Tablet', 'Audio', 'Watches', 'Camera', 'Gaming', 'Network', 'Accessories'];

    useEffect(() => {
        if (isEditing) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setFormData({
                name: data.name,
                description: data.description,
                price: data.price,
                category: data.category,
                image: data.image,
                stock: data.stock || 10
            });

            // Parse specs JSON to array
            if (data.specs && typeof data.specs === 'object') {
                const specsArray = Object.entries(data.specs)
                    .filter(([key]) => key !== 'variants') // Exclude variants from simple specs list
                    .map(([key, value]) => ({ key, value }));
                setSpecs(specsArray);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            alert('Failed to load product details');
            navigate('/admin/products');
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Specs Handlers
    const addSpec = () => {
        setSpecs([...specs, { key: '', value: '' }]);
    };

    const removeSpec = (index) => {
        setSpecs(specs.filter((_, i) => i !== index));
    };

    const handleSpecChange = (index, field, value) => {
        const newSpecs = [...specs];
        newSpecs[index][field] = value;
        setSpecs(newSpecs);
    };

    const handleDelete = async () => {
        console.log('--- DEBUG START ---');
        console.log('Target Product ID:', id);
        console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL); // Verify project connection

        if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
        setLoading(true);

        try {
            // Create a timeout to prevent hanging
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            // Standard delete with data return and timeout
            const { data, error } = await supabase
                .rpc('delete_product_v2', { target_id: id });

            clearTimeout(timeoutId);

            if (error) {
                console.error('Supabase DELETE Error Object:', error);
                throw error;
            }

            console.log('Delete successful!');
            alert('Product deleted successfully!');
            navigate('/admin/products');
        } catch (error) {
            console.error('Catch Block Error:', error);
            const errorMessage = error.name === 'AbortError' ? 'Request timed out. Network or Database is unresponsive.' : error.message;
            alert(`Failed to delete product:\n${errorMessage}\n\nDetails: ${error.details || 'None'}`);
            setLoading(false);
        }
        console.log('--- DEBUG END ---');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const productData = {
                ...formData,
                specs: specs.reduce((acc, spec) => {
                    if (spec.key && spec.value) {
                        acc[spec.key] = spec.value;
                    }
                    return acc;
                }, {})
            };

            if (isEditing) {
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([productData]);
                if (error) throw error;
            }

            navigate('/admin/products');
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-8 text-center text-secondary">Loading product details...</div>;

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            setFormData(prev => ({
                ...prev,
                image: data.publicUrl
            }));

            console.log('Image uploaded successfully:', data.publicUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/admin/products')}
                    className="p-2 text-secondary hover:text-primary hover:bg-white/5 rounded-lg transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-primary">
                        {isEditing ? 'Edit Product' : 'Add New Product'}
                    </h1>
                    <p className="text-secondary text-sm">
                        {isEditing ? 'Update product details' : 'Create a new product listing'}
                    </p>
                </div>
                {isEditing && (
                    <button
                        onClick={handleDelete}
                        className="ml-auto flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors border border-red-500/20"
                    >
                        <Trash2 size={20} />
                        <span>Delete Product</span>
                    </button>
                )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-surface border border-white/5 rounded-2xl p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-secondary">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-2 text-primary focus:outline-none focus:border-accent"
                            placeholder="e.g. Lumina X1 Pro"
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-secondary">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-2 text-primary focus:outline-none focus:border-accent"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-secondary">Price (Rp)</label>
                        <input
                            type="number"
                            name="price"
                            required
                            min="0"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-2 text-primary focus:outline-none focus:border-accent"
                            placeholder="0"
                        />
                    </div>

                    {/* Stock */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-secondary">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            required
                            min="0"
                            value={formData.stock}
                            onChange={handleChange}
                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-2 text-primary focus:outline-none focus:border-accent"
                            placeholder="10"
                        />
                    </div>

                    {/* Image URL & Upload */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-secondary">Image</label>
                        <div className="flex gap-4">
                            <input
                                type="url"
                                name="image"
                                required
                                value={formData.image}
                                onChange={handleChange}
                                className="flex-1 bg-background border border-white/10 rounded-xl px-4 py-2 text-primary focus:outline-none focus:border-accent"
                                placeholder="Paste URL or upload image"
                            />
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                className="hidden"
                                accept="image/*"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="px-4 py-2 bg-white/5 text-secondary rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50 flex items-center gap-2"
                                title="Upload Image"
                            >
                                <Upload size={20} />
                                <span className="text-sm hidden sm:inline">{uploading ? 'Uploading...' : 'Upload'}</span>
                            </button>
                        </div>
                        {formData.image && (
                            <div className="mt-2 w-32 h-32 rounded-lg overflow-hidden border border-white/10 relative group">
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-secondary">Description</label>
                        <textarea
                            name="description"
                            required
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-2 text-primary focus:outline-none focus:border-accent resize-none"
                            placeholder="Product description..."
                        ></textarea>
                    </div>

                    {/* Specifications */}
                    <div className="space-y-4 md:col-span-2 border-t border-white/5 pt-6">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-secondary">Specifications</label>
                            <button
                                type="button"
                                onClick={addSpec}
                                className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-lg hover:bg-accent hover:text-white transition-colors"
                            >
                                + Add Spec
                            </button>
                        </div>

                        <div className="space-y-3">
                            {specs.map((spec, index) => (
                                <div key={index} className="flex gap-4 items-start">
                                    <input
                                        type="text"
                                        placeholder="Key (e.g. Screen)"
                                        value={spec.key}
                                        onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                                        className="flex-1 bg-background border border-white/10 rounded-xl px-4 py-2 text-primary text-sm focus:outline-none focus:border-accent"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Value (e.g. 14 inch OLED)"
                                        value={spec.value}
                                        onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                                        className="flex-1 bg-background border border-white/10 rounded-xl px-4 py-2 text-primary text-sm focus:outline-none focus:border-accent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeSpec(index)}
                                        className="p-2 text-secondary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            {specs.length === 0 && (
                                <p className="text-xs text-secondary italic">No specifications added yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end pt-4 border-t border-white/5">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50"
                    >
                        <Save size={20} />
                        <span>{loading ? 'Saving...' : 'Save Product'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
