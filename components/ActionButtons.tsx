import React, { useState, useEffect } from 'react';
import { UploadIcon, DownloadIcon, SaveIcon, CheckIcon, SpinnerIcon, ExportIcon } from './icons';

interface ActionButtonsProps {
    onUploadClick: () => void;
    onDownloadAll: () => void;
    onDownloadFiltered: () => void;
    onSave: () => void;
    isDataLoaded: boolean;
    filteredAssetsCount: number;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onUploadClick, onDownloadAll, onDownloadFiltered, onSave, isDataLoaded, filteredAssetsCount }) => {
    const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');

    useEffect(() => {
        if (!isDataLoaded) {
            setSaveState('idle');
        }
    }, [isDataLoaded]);

    const handleSaveClick = () => {
        setSaveState('saving');
        onSave();
        setTimeout(() => {
            setSaveState('saved');
            setTimeout(() => setSaveState('idle'), 2000);
        }, 500);
    };

    const getSaveButtonContent = () => {
        switch (saveState) {
            case 'saving':
                return <><SpinnerIcon className="w-5 h-5 animate-spin" /><span>Saving...</span></>;
            case 'saved':
                return <><CheckIcon className="w-5 h-5" /><span>Saved</span></>;
            default:
                return <><SaveIcon className="w-5 h-5" /><span>Save Changes</span></>;
        }
    };

    return (
        <div className="bg-base-100 dark:bg-base-dark-200 p-4 rounded-xl shadow-lg border border-base-300 dark:border-base-dark-100 animate-fade-in">
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
                <button onClick={onUploadClick} className="btn-primary flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200">
                    <UploadIcon className="w-5 h-5" />
                    <span>Upload Sheet</span>
                </button>
                <button onClick={handleSaveClick} disabled={!isDataLoaded || saveState !== 'idle'} className="btn-secondary flex items-center justify-center space-x-2 px-4 py-2 w-40 h-10 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed">
                   {getSaveButtonContent()}
                </button>
                <button onClick={onDownloadAll} disabled={!isDataLoaded} className="btn-success flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed">
                    <DownloadIcon className="w-5 h-5" />
                    <span>Export All</span>
                </button>
                 <button onClick={onDownloadFiltered} disabled={!isDataLoaded || filteredAssetsCount === 0} className="btn-info flex items-center space-x-2 px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition-colors duration-200 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed">
                    <ExportIcon className="w-5 h-5" />
                    <span>Export Filtered</span>
                </button>
            </div>
        </div>
    );
};

export default ActionButtons;