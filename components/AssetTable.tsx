import React from 'react';
import { Asset, SortConfig } from '../types';
import { SortIcon, EditIcon } from './icons';

interface AssetTableProps {
    assets: Asset[];
    onEdit: (assetId: string) => void;
    sortConfig: SortConfig;
    onSort: (key: keyof Asset) => void;
    isLoading: boolean;
    totalFilteredCount: number;
    currentPage: number;
    itemsPerPage: number;
}

const essentialColumns: (keyof Asset)[] = ['Serial Number', 'Asset Code', 'Asset Type', 'Branch Name', 'pavStatus', 'engineerName'];

const columnDisplayNames: { [key in keyof Asset]?: string } = {
    'Serial Number': 'Serial Number',
    'Asset Code': 'Asset Code',
    'Asset Type': 'Asset Type',
    'Branch Name': 'Branch Name',
    'pavStatus': 'Verification Status',
    'engineerName': 'Auditor',
};

const AssetTable: React.FC<AssetTableProps> = ({ assets, onEdit, sortConfig, onSort, isLoading, totalFilteredCount, currentPage, itemsPerPage }) => {
    
    const getSortDirectionClass = (key: keyof Asset) => {
        if (!sortConfig || sortConfig.key !== key) return 'text-gray-400';
        return sortConfig.direction === 'ascending' ? 'text-primary-500' : 'text-primary-500 rotate-180';
    };

    const startItem = totalFilteredCount > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endItem = Math.min(currentPage * itemsPerPage, totalFilteredCount);

    if (isLoading) {
        return (
             <div className="bg-base-100 dark:bg-base-dark-200 rounded-xl shadow-lg border border-base-300 dark:border-base-dark-100 overflow-hidden">
                <div className="p-4 border-b border-base-200 dark:border-gray-700">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-base-200 dark:divide-gray-700">
                        <thead className="bg-base-200 dark:bg-base-dark-100">
                            <tr>
                                {essentialColumns.map(key => (
                                    <th key={String(key)} scope="col" className="px-6 py-3 text-left text-xs font-medium text-base-content dark:text-base-dark-300 uppercase tracking-wider">
                                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                                    </th>
                                ))}
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-base-100 dark:bg-base-dark-200 divide-y divide-base-200 dark:divide-gray-700">
                            {Array.from({ length: 10 }).map((_, index) => (
                                <tr key={index}>
                                    {essentialColumns.map(key => (
                                        <td key={String(key)} className="px-6 py-4">
                                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse ml-auto"></div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    if (totalFilteredCount === 0) {
        return (
            <div className="text-center py-16 bg-base-100 dark:bg-base-dark-200 rounded-xl shadow-lg border border-base-300 dark:border-base-dark-100">
                <p className="text-base-content dark:text-base-dark-300 text-lg">No assets to display.</p>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Please upload a file or adjust your search/filter criteria.</p>
            </div>
        )
    }

    return (
        <div className="bg-base-100 dark:bg-base-dark-200 rounded-xl shadow-lg border border-base-300 dark:border-base-dark-100 overflow-hidden animate-slide-in-up" style={{ animationDelay: '200ms' }}>
            <div className="p-4 border-b border-base-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                Showing <strong>{startItem}</strong> - <strong>{endItem}</strong> of <strong>{totalFilteredCount}</strong> assets
            </div>
            <div className="overflow-auto max-h-[65vh]">
                <table className="min-w-full divide-y divide-base-200 dark:divide-gray-700">
                    <thead className="bg-base-200 dark:bg-base-dark-100">
                        <tr>
                            {essentialColumns.map(key => (
                                <th key={String(key)} scope="col" className="px-6 py-3 text-left text-xs font-medium text-base-content dark:text-base-dark-300 uppercase tracking-wider sticky top-0 bg-base-200 dark:bg-base-dark-100">
                                    <button onClick={() => onSort(key)} className="flex items-center space-x-1 group">
                                        <span>{columnDisplayNames[key] || String(key).replace(/([A-Z])/g, ' $1').trim()}</span>
                                        <SortIcon className={`w-4 h-4 transition-colors ${getSortDirectionClass(key)}`} />
                                    </button>
                                </th>
                            ))}
                            <th scope="col" className="relative px-6 py-3 sticky top-0 bg-base-200 dark:bg-base-dark-100">
                                <span className="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-base-100 dark:bg-base-dark-200 divide-y divide-base-200 dark:divide-gray-700">
                        {assets.map((asset) => (
                            <tr key={asset._pav_id} className={`transition-colors duration-150 
                                ${asset._pav_edited ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'odd:bg-transparent even:bg-black/5 dark:even:bg-white/5'}
                                hover:bg-primary-100/50 dark:hover:bg-primary-900/20
                            `}>
                                {essentialColumns.map(key => (
                                    <td key={String(key)} className="px-6 py-4 whitespace-nowrap text-sm text-base-content dark:text-base-dark-300">
                                        {key === 'pavStatus' ? (
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                asset.pavStatus === 'Available' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                asset.pavStatus === 'Not Available' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                            }`}>
                                                {asset.pavStatus}
                                            </span>
                                        ) : asset[key]}
                                    </td>

                                ))}
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => onEdit(asset._pav_id)} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200 p-1 rounded-md hover:bg-primary-100 dark:hover:bg-base-dark-100 transition">
                                        <EditIcon className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssetTable;