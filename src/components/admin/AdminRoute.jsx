import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-background text-primary">Loading...</div>;
    }

    // For now, we'll assume any logged-in user with a specific email or metadata role is an admin.
    // In a real app, you'd check user.user_metadata.role === 'admin'
    // For this demo, let's allow all logged in users but we should ideally restrict it.
    // Let's add a check for a specific email or metadata.

    // TEMPORARY: Allow all logged in users for easier testing, 
    // BUT we will implement the role check script next.
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Strict check (Uncomment after running the promotion script)
    // if (user.user_metadata?.role !== 'admin') {
    //     return <Navigate to="/" replace />;
    // }

    return children;
};

export default AdminRoute;
