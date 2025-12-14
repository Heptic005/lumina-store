import { useState, useEffect, useRef } from 'react';
import { Star, Upload, User, Image as ImageIcon, Trash2, Send, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const ReviewSection = ({ productId }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [averageRating, setAverageRating] = useState(0);

    // Form State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    // Purchase Verification State
    const [hasOrdered, setHasOrdered] = useState(false);

    useEffect(() => {
        fetchReviews();
        if (user) {
            checkPurchase();
        }
    }, [productId, user]);

    const checkPurchase = async () => {
        try {
            console.log('Checking purchase for User:', user.id, 'Product:', productId);

            // Query orders with status 'Delivered' and join order_items
            const { data: orders, error } = await supabase
                .from('orders')
                .select(`
                    status,
                    order_items (
                        product_id
                    )
                `)
                .eq('user_id', user.id)
                .eq('status', 'Delivered');

            console.log('Fetched Orders for Review:', orders, 'Error:', error);

            if (error) throw error;

            let found = false;
            if (orders) {
                // Flatten all items from DELIVERED orders
                const allItems = orders.flatMap(order => order.order_items || []);
                console.log('All Items in Delivered Orders:', allItems);

                found = allItems.some(item => item.product_id === productId);
            }
            console.log('Has Ordered Result:', found);
            setHasOrdered(found);
        } catch (error) {
            console.error('Error checking purchase:', error);
        }
    };

    const fetchReviews = async () => {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('product_id', productId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setReviews(data || []);

            // Calculate Average
            if (data && data.length > 0) {
                const total = data.reduce((acc, curr) => acc + curr.rating, 0);
                setAverageRating(total / data.length);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return alert('Please login to write a review');

        setSubmitting(true);
        try {
            let imageUrl = null;

            // 1. Upload Image if exists
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${productId}/${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('reviews')
                    .upload(fileName, imageFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('reviews')
                    .getPublicUrl(fileName);

                imageUrl = publicUrl;
            }

            // 2. Insert Review to DB
            const { error: insertError } = await supabase
                .from('reviews')
                .insert({
                    product_id: productId,
                    user_id: user.id || user.sesssion?.user?.id,
                    user_name: user.user_metadata?.full_name || 'Anonymous User',
                    rating,
                    comment,
                    image_url: imageUrl
                });

            if (insertError) throw insertError;

            // Reset Form and Refetch
            setComment('');
            setRating(5);
            handleRemoveImage();
            fetchReviews();
            alert('Review submitted successfully!');

        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Make sure you have setup the database!');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold text-primary mb-8">Customer Reviews</h2>

            {/* Stats */}
            <div className="bg-surface rounded-2xl p-8 border border-white/5 mb-8 flex flex-col md:flex-row items-center gap-8">
                <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-2">
                        {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
                    </div>
                    <div className="flex gap-1 justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-5 h-5 ${i < Math.round(averageRating) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}`}
                            />
                        ))}
                    </div>
                    <p className="text-secondary text-sm">{reviews.length} Reviews</p>
                </div>

                <div className="flex-1 w-full border-l border-white/5 md:pl-8">
                    <p className="text-secondary italic">Share your thoughts with other customers!</p>
                </div>
            </div>

            {/* Review Form */}
            {user ? (
                hasOrdered ? (
                    <form onSubmit={handleSubmit} className="bg-surface rounded-2xl p-8 border border-white/5 mb-12">
                        <h3 className="text-lg font-bold text-primary mb-6">Write a Review</h3>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-secondary mb-2">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-secondary mb-2">Your Review</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                                rows="4"
                                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent transition-colors resize-none"
                                placeholder="Tell us what you liked or disliked..."
                            ></textarea>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-secondary mb-2">Add Photo (Optional)</label>
                            <div className="flex items-start gap-4">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-white/20 rounded-xl hover:border-accent hover:bg-accent/5 transition-all text-secondary hover:text-accent"
                                >
                                    <ImageIcon className="w-6 h-6 mb-1" />
                                    <span className="text-xs">Upload</span>
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />

                                {imagePreview && (
                                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10 group">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-accent text-background px-8 py-3 rounded-xl font-bold hover:bg-accent/90 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {submitting ? 'Submitting...' : (
                                <>
                                    Submit Review <Send className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="bg-surface/50 rounded-2xl p-8 border border-white/5 text-center mb-12">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="w-8 h-8 text-secondary opacity-50" />
                        </div>
                        <h3 className="text-lg font-bold text-primary mb-2">Have you used this product?</h3>
                        <p className="text-secondary">You must have a <span className="text-accent font-bold">delivered order</span> for this item to write a review.</p>
                    </div>
                )
            ) : (
                <div className="bg-surface/50 rounded-2xl p-8 border border-white/5 text-center mb-12">
                    <p className="text-secondary mb-4">Please log in to write a review.</p>
                </div>
            )}

            {/* Review List */}
            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <div className="text-center py-12 text-secondary opacity-70">
                        No reviews yet. Be the first to review!
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-surface rounded-2xl p-6 border border-white/5">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-secondary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-primary">{review.user_name}</h4>
                                        <div className="flex text-yellow-500 text-xs">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'text-gray-600'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-secondary">{new Date(review.created_at).toLocaleDateString()}</span>
                            </div>

                            <p className="text-secondary leading-relaxed mb-4">
                                {review.comment}
                            </p>

                            {review.image_url && (
                                <div className="w-32 h-32 rounded-xl overflow-hidden border border-white/5 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open(review.image_url, '_blank')}>
                                    <img src={review.image_url} alt="Review attachment" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewSection;
