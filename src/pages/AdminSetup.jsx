import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminSetup = () => {
    const { user, updateProfile } = useAuth();
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    const handlePromote = async () => {
        if (!user) {
            setStatus('Please login first.');
            return;
        }

        try {
            setStatus('Promoting...');
            await updateProfile({ role: 'admin' });
            setStatus('Success! You are now an admin.');
            setTimeout(() => navigate('/admin'), 1500);
        } catch (error) {
            console.error(error);
            setStatus('Error: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-primary">
            <div className="p-8 bg-surface border border-white/10 rounded-2xl text-center">
                <h1 className="text-2xl font-bold mb-4">Admin Setup</h1>
                <p className="mb-6 text-secondary">Click below to promote your account to Admin.</p>
                <button
                    onClick={handlePromote}
                    className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors"
                >
                    Promote Me to Admin
                </button>
                {status && <p className="mt-4 text-sm font-medium text-green-400">{status}</p>}
            </div>
        </div>
    );
};

export default AdminSetup;
