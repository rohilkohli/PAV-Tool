import React, { useMemo } from 'react';
import { Asset, PAVStatus } from '../types';

interface DashboardProps {
    assets: Asset[];
    isLoading: boolean;
}

const SkeletonBar: React.FC = () => (
    <div className="p-4 bg-base-100 dark:bg-base-dark-200 rounded-xl shadow-lg border border-base-300 dark:border-base-dark-100 animate-pulse">
        <div className="h-2.5 bg-gray-300 dark:bg-gray-700 rounded-full w-full mb-3"></div>
        <div className="flex justify-between">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ assets, isLoading }) => {
    const { stats, percentages } = useMemo(() => {
        const stats = assets.reduce(
            (acc, asset) => {
                if (asset.pavStatus === PAVStatus.Available) acc.available += 1;
                else if (asset.pavStatus === PAVStatus.NotAvailable) acc.notAvailable += 1;
                else acc.notDone += 1;
                return acc;
            },
            { available: 0, notAvailable: 0, notDone: 0 }
        );

        const total = assets.length;
        const percentages = {
            available: total > 0 ? (stats.available / total) * 100 : 0,
            notAvailable: total > 0 ? (stats.notAvailable / total) * 100 : 0,
            notDone: total > 0 ? (stats.notDone / total) * 100 : 0,
        };

        return { stats, percentages };
    }, [assets]);

    if (isLoading) {
        return <SkeletonBar />;
    }

    return (
        <div className="p-4 bg-base-100 dark:bg-base-dark-200 rounded-xl shadow-lg border border-base-300 dark:border-base-dark-100 animate-slide-in-up">
            <div className="flex w-full h-2.5 bg-base-200 dark:bg-gray-700 rounded-full overflow-hidden" role="progressbar" aria-valuenow={percentages.available} aria-valuemin={0} aria-valuemax={100}>
                <div className="bg-green-500 transition-all duration-500" style={{ width: `${percentages.available}%` }} title={`Available: ${percentages.available.toFixed(1)}%`}></div>
                <div className="bg-red-500 transition-all duration-500" style={{ width: `${percentages.notAvailable}%` }} title={`Not Available: ${percentages.notAvailable.toFixed(1)}%`}></div>
                <div className="bg-yellow-500 transition-all duration-500" style={{ width: `${percentages.notDone}%` }} title={`Pending: ${percentages.notDone.toFixed(1)}%`}></div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between text-xs mt-3 text-base-content dark:text-base-dark-300 space-y-1 sm:space-y-0">
                <div className="flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></span>
                    <span>Available: <strong>{stats.available}</strong> ({percentages.available.toFixed(1)}%)</span>
                </div>
                <div className="flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2"></span>
                    <span>Not Available: <strong>{stats.notAvailable}</strong> ({percentages.notAvailable.toFixed(1)}%)</span>
                </div>
                <div className="flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 mr-2"></span>
                    <span>Pending: <strong>{stats.notDone}</strong> ({percentages.notDone.toFixed(1)}%)</span>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;