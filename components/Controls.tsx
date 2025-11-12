import React from 'react';
import { PAVStatus } from '../types';
import { SearchIcon, CloseIcon } from './icons';

interface ControlsProps {
    engineerName: string;
    setEngineerName: (name: string) => void;
    pavDate: string;
    setPavDate: (date: string) => void;
    assetTypes: string[];
    models: string[];
    onFilterChange: (filters: { assetType: string; model: string; pavStatus: string }) => void;
    onSearch: (term: string, criteria: 'Serial Number' | 'Asset Code') => void;
    filters: { assetType: string; model: string; pavStatus: string };
}

const Controls: React.FC<ControlsProps> = ({
    engineerName, setEngineerName, pavDate, setPavDate, assetTypes, models, onFilterChange, onSearch, filters
}) => {
    const [searchCriteria, setSearchCriteria] = React.useState<'Serial Number' | 'Asset Code'>('Serial Number');
    const [searchTerm, setSearchTerm] = React.useState('');
    
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm, searchCriteria);
    };
    
    const handleClearSearch = () => {
        setSearchTerm('');
        onSearch('', searchCriteria);
    };

    const handleFilterUpdate = (filterName: keyof typeof filters, value: string) => {
        const newFilters = { ...filters, [filterName]: value };
        if (filterName === 'assetType') {
            newFilters.model = 'All'; // Reset model when asset type changes
        }
        onFilterChange(newFilters);
    };


    return (
        <div className="p-6 bg-base-100 dark:bg-base-dark-200 rounded-xl shadow-lg border border-base-300 dark:border-base-dark-100 space-y-6 animate-slide-in-up" style={{ animationDelay: '100ms' }}>
            {/* Auditor and Date Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="engineerName" className="block text-sm font-medium text-base-content dark:text-base-dark-300 mb-1">Auditor Name</label>
                    <input
                        type="text"
                        id="engineerName"
                        value={engineerName}
                        onChange={(e) => setEngineerName(e.target.value)}
                        className="w-full px-3 py-2 bg-base-200 dark:bg-base-dark-100 border border-base-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 transition"
                        placeholder="Enter your name"
                    />
                </div>
                <div>
                    <label htmlFor="pavDate" className="block text-sm font-medium text-base-content dark:text-base-dark-300 mb-1">Audit Date</label>
                    <input
                        type="date"
                        id="pavDate"
                        value={pavDate}
                        onChange={(e) => setPavDate(e.target.value)}
                        className="w-full px-3 py-2 bg-base-200 dark:bg-base-dark-100 border border-base-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 transition"
                    />
                </div>
            </div>

            {/* Search */}
            <div className="py-2">
                <div className="flex justify-center">
                    <div className="w-full md:w-3/4 lg:w-1/2">
                        <label className="block text-sm font-medium text-base-content dark:text-base-dark-300 mb-1 text-center">Search by Serial Number or Asset Code</label>
                        <form onSubmit={handleSearch} className="flex">
                            <select
                                value={searchCriteria}
                                onChange={(e) => setSearchCriteria(e.target.value as 'Serial Number' | 'Asset Code')}
                                className="px-3 py-2 bg-base-200 dark:bg-base-dark-100 border border-r-0 border-base-300 dark:border-gray-600 rounded-l-md focus:ring-primary-500 focus:border-primary-500 transition text-sm"
                            >
                                <option>Serial Number</option>
                                <option>Asset Code</option>
                            </select>
                            <div className="relative flex-grow">
                                 <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-3 pr-20 py-2 bg-base-200 dark:bg-base-dark-100 border border-base-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 transition rounded-r-md"
                                    placeholder={`Search by ${searchCriteria}...`}
                                />
                                {searchTerm && (
                                    <button 
                                        type="button" 
                                        onClick={handleClearSearch} 
                                        className="absolute inset-y-0 right-10 flex items-center px-3 text-gray-500 hover:text-red-500 transition-colors"
                                        aria-label="Clear search"
                                    >
                                       <CloseIcon className="w-4 h-4" />
                                    </button>
                                )}
                                <button type="submit" className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-primary-500">
                                   <SearchIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>


            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-base-300 dark:border-gray-700 pt-6">
                <div>
                    <label htmlFor="assetTypeFilter" className="block text-sm font-medium text-base-content dark:text-base-dark-300 mb-1">Filter by Asset Type</label>
                    <select
                        id="assetTypeFilter"
                        value={filters.assetType}
                        onChange={(e) => handleFilterUpdate('assetType', e.target.value)}
                        className="w-full px-3 py-2 bg-base-200 dark:bg-base-dark-100 border border-base-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 transition"
                    >
                        <option>All</option>
                        {assetTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="modelFilter" className="block text-sm font-medium text-base-content dark:text-base-dark-300 mb-1">Filter by Model</label>
                    <select
                        id="modelFilter"
                        value={filters.model}
                        onChange={(e) => handleFilterUpdate('model', e.target.value)}
                        className="w-full px-3 py-2 bg-base-200 dark:bg-base-dark-100 border border-base-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 transition"
                    >
                        <option>All</option>
                        {models.map(model => <option key={model} value={model}>{model}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="pavStatusFilter" className="block text-sm font-medium text-base-content dark:text-base-dark-300 mb-1">Filter by Verification Status</label>
                    <select
                        id="pavStatusFilter"
                        value={filters.pavStatus}
                        onChange={(e) => handleFilterUpdate('pavStatus', e.target.value)}
                        className="w-full px-3 py-2 bg-base-200 dark:bg-base-dark-100 border border-base-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 transition"
                    >
                        <option>All</option>
                        {Object.values(PAVStatus).map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Controls;