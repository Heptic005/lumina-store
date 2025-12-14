import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
        warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />
    };

    const bgColors = {
        success: 'bg-green-500/10 border-green-500/20',
        error: 'bg-red-500/10 border-red-500/20',
        info: 'bg-blue-500/10 border-blue-500/20',
        warning: 'bg-yellow-500/10 border-yellow-500/20'
    };

    return (
        <div className={`flex items-center gap-3 min-w-[320px] p-4 rounded-xl border backdrop-blur-md shadow-xl animate-fade-in-up ${bgColors[type]} bg-surface/95`}>
            <div className="flex-shrink-0">
                {icons[type]}
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-primary">{message}</p>
            </div>
            <button
                onClick={onClose}
                className="p-1 hover:bg-white/10 rounded-full transition-colors text-secondary hover:text-primary"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;
