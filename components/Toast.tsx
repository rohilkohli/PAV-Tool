import React, { useEffect } from 'react';
import { CheckIcon, CloseIcon } from './icons';

interface ToastProps {
    message: string;
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => {
            clearTimeout(timer);
        };
    }, [onClose, duration]);

    return (
        <div className="fixed bottom-5 right-5 z-50 animate-slide-in-up">
            <div className="flex items-center bg-green-500 text-white py-3 px-5 rounded-lg shadow-lg">
                <CheckIcon className="w-6 h-6 mr-3" />
                <p className="font-medium">{message}</p>
                <button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-green-600 transition-colors">
                    <CloseIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Toast;
