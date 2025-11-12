import React from 'react';
import { UploadIcon, DocumentCheckIcon, FilterIcon, PencilIcon, SaveIcon } from './icons';

interface WelcomeScreenProps {
    onUploadClick: () => void;
}

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-base-200 dark:bg-base-dark-100 p-6 rounded-lg transition-transform transform hover:scale-105">
        <div className="mb-4">{icon}</div>
        <h3 className="font-bold text-lg mb-2 text-base-content dark:text-base-dark-300">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
);

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onUploadClick }) => {
    return (
        <div className="text-center py-16 px-4 bg-base-100 dark:bg-base-dark-200 rounded-xl shadow-lg border border-base-300 dark:border-base-dark-100 animate-fade-in">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 animate-slide-in-up">
                    <div className="w-24 h-24 mx-auto bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center ring-4 ring-primary-200 dark:ring-primary-500/30">
                        <DocumentCheckIcon className="w-12 h-12 text-primary-600 dark:text-primary-400" />
                    </div>
                </div>
                <h2 className="text-4xl font-extrabold text-base-content dark:text-base-dark-content mb-4 animate-slide-in-up" style={{ animationDelay: '100ms' }}>
                    Streamline Your Asset Verification
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto animate-slide-in-up" style={{ animationDelay: '200ms' }}>
                    Upload your Excel or CSV file to instantly search, filter, and update asset information with our intuitive and powerful tool.
                </p>
                <button
                    onClick={onUploadClick}
                    className="inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 text-lg font-semibold shadow-lg animate-slide-in-up"
                    style={{ animationDelay: '300ms' }}
                >
                    <UploadIcon className="w-6 h-6" />
                    <span>Upload Asset File</span>
                </button>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left animate-slide-in-up" style={{ animationDelay: '400ms' }}>
                    <FeatureCard
                        icon={<UploadIcon className="w-8 h-8 text-primary-500" />}
                        title="Effortless Upload"
                        description="Supports both .xlsx and .csv file formats for seamless data import."
                    />
                    <FeatureCard
                        icon={<FilterIcon className="w-8 h-8 text-primary-500" />}
                        title="Powerful Filtering"
                        description="Quickly narrow down assets by type, model, status, and more."
                    />
                    <FeatureCard
                        icon={<PencilIcon className="w-8 h-8 text-primary-500" />}
                        title="Intuitive Editing"
                        description="Update asset details through an easy-to-use modal interface."
                    />
                    <FeatureCard
                        icon={<SaveIcon className="w-8 h-8 text-primary-500" />}
                        title="Save & Export"
                        description="Persist your changes locally and download the updated file anytime."
                    />
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;
