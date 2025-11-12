import React, { useEffect } from 'react';
import { CloseIcon } from './icons';

interface ConfirmationModalProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onClose: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ title, message, onConfirm, onClose }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-base-100 dark:bg-base-dark-200 rounded-lg shadow-2xl w-full max-w-md m-4 animate-slide-in-up" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-base-300 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-base-content dark:text-base-dark-300">{title}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-base-200 dark:hover:bg-base-dark-100 transition">
                        <CloseIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
                <div className="p-6">
                    <p className="text-base-content dark:text-base-dark-300">{message}</p>
                </div>
                <div className="p-4 bg-base-200 dark:bg-base-dark-100 border-t border-base-300 dark:border-gray-700 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition font-semibold">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition font-semibold">Proceed</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
