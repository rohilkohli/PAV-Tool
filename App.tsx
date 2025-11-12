import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Asset, SortConfig } from './types';
import { readDataFromFile, writeDataToFile } from './utils/fileHandler';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Controls from './components/Controls';
import AssetTable from './components/AssetTable';
import EditModal from './components/EditModal';
import Pagination from './components/Pagination';
import ConfirmationModal from './components/ConfirmationModal';
import WelcomeScreen from './components/WelcomeScreen';
import Toast from './components/Toast';
import ActionButtons from './components/ActionButtons';

const ITEMS_PER_PAGE = 50;

function App() {
    const [allAssets, setAllAssets] = useState<Asset[]>([]);
    const [originalHeaders, setOriginalHeaders] = useState<string[]>([]);
    const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
    const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const [isUploadConfirmOpen, setIsUploadConfirmOpen] = useState(false);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [toast, setToast] = useState<{ message: string, id: number } | null>(null);

    const [engineerName, setEngineerName] = useState('');
    const [pavDate, setPavDate] = useState(new Date().toISOString().split('T')[0]);
    
    const [filters, setFilters] = useState({ assetType: 'All', model: 'All', pavStatus: 'All' });
    const [searchTerm, setSearchTerm] = useState({ term: '', criteria: 'Serial Number' as 'Serial Number' | 'Asset Code' });
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);
    const [currentPage, setCurrentPage] = useState(1);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        try {
            setIsLoading(true);
            const saved = localStorage.getItem('pav_assets');
            const savedHeaders = localStorage.getItem('pav_headers');
            if(saved && savedHeaders) {
                setAllAssets(JSON.parse(saved));
                setOriginalHeaders(JSON.parse(savedHeaders));
            }
        } catch (error) {
            console.error('Failed to load assets from localStorage', error);
            localStorage.removeItem('pav_assets');
            localStorage.removeItem('pav_headers');
        } finally {
            setIsLoading(false);
        }
    }, []);


    const editingAsset = useMemo(
        () => editingAssetId ? allAssets.find(a => a._pav_id === editingAssetId) : null,
        [allAssets, editingAssetId]
    );

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (allAssets.length > 0 && !isUploadConfirmOpen) {
                setPendingFile(file);
                setIsUploadConfirmOpen(true);
            } else {
                processFile(file);
            }
        }
        if (event.target) event.target.value = '';
    };

    const processFile = async (file: File) => {
        try {
            setError(null);
            setIsLoading(true);
            const { assets, headers } = await readDataFromFile(file);
            setAllAssets(assets);
            setOriginalHeaders(headers);
            setCurrentPage(1);
            setFilters({ assetType: 'All', model: 'All', pavStatus: 'All' }); // Reset filters
        } catch (err) {
            console.error(err);
            setError('Failed to read or parse the file. Please ensure it is a valid .xlsx or .csv file.');
        } finally {
            setIsLoading(false);
            setPendingFile(null);
            setIsUploadConfirmOpen(false);
        }
    };

    const handleConfirmUpload = () => {
        if (pendingFile) {
            processFile(pendingFile);
        }
    };

    const handleCancelUpload = () => {
        setPendingFile(null);
        setIsUploadConfirmOpen(false);
    };
    
    const generateFileName = (prefix: string): string => {
        const engineer = (engineerName.trim() || 'auditor').replace(/\s+/g, '_');
        const date = pavDate || new Date().toISOString().split('T')[0];
        return `${prefix}_${engineer}_${date}.xlsx`;
    };

    const handleDownloadAll = () => {
        const fileName = generateFileName('verified_assets');
        writeDataToFile(allAssets, originalHeaders, fileName);
    };

    const handleDownloadFiltered = () => {
        const fileName = generateFileName('filtered_verified_assets');
        writeDataToFile(filteredAssets, originalHeaders, fileName);
    };

    const handleSaveProgress = () => {
        try {
            localStorage.setItem('pav_assets', JSON.stringify(allAssets));
            localStorage.setItem('pav_headers', JSON.stringify(originalHeaders));
            setToast({ message: 'Progress saved successfully', id: Date.now() });
        } catch (error)
        {
            setError('Failed to save progress to local storage. Storage might be full.');
        }
    };
    
    const assetTypes = useMemo(() => {
        const types = new Set(allAssets.map(a => a['Asset Type']));
        return Array.from(types).filter(Boolean).sort();
    }, [allAssets]);

    const models = useMemo(() => {
        let relevantAssets = allAssets;
        if (filters.assetType !== 'All') {
            relevantAssets = allAssets.filter(a => a['Asset Type'] === filters.assetType);
        }
        const modelSet = new Set(relevantAssets.map(a => a['Model']));
        return Array.from(modelSet).filter(Boolean).sort();
    }, [allAssets, filters.assetType]);

    const applyFiltersAndSearch = useCallback(() => {
        let assets = [...allAssets];

        if (filters.assetType !== 'All') {
            assets = assets.filter(a => a['Asset Type'] === filters.assetType);
        }
        if (filters.model !== 'All') {
            assets = assets.filter(a => a['Model'] === filters.model);
        }
        if (filters.pavStatus !== 'All') {
            assets = assets.filter(a => a.pavStatus === filters.pavStatus);
        }
        
        if (searchTerm.term) {
            assets = assets.filter(a => 
                String(a[searchTerm.criteria] || '').toLowerCase().includes(searchTerm.term.toLowerCase())
            );
        }

        if (sortConfig !== null) {
            assets.sort((a, b) => {
                const aValue = a[sortConfig.key] || '';
                const bValue = b[sortConfig.key] || '';
                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        
        setFilteredAssets(assets);
        if (currentPage > Math.ceil(assets.length / ITEMS_PER_PAGE) && assets.length > 0) {
            setCurrentPage(1);
        } else if (assets.length === 0) {
            setCurrentPage(1);
        }

    }, [allAssets, filters, searchTerm, sortConfig, currentPage]);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            applyFiltersAndSearch();
            setIsLoading(false);
        }, 50);
        
        return () => clearTimeout(timer);
    }, [allAssets, filters, searchTerm, sortConfig, applyFiltersAndSearch]);

    const handleFilterChange = useCallback((newFilters: { assetType: string; model: string; pavStatus: string }) => {
        setCurrentPage(1);
        setFilters(newFilters);
    }, []);

    const handleSearch = useCallback((term: string, criteria: 'Serial Number' | 'Asset Code') => {
        setCurrentPage(1);
        setSearchTerm({ term, criteria });
    }, []);

    const handleSort = (key: keyof Asset) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleSaveAsset = (updatedAsset: Asset) => {
        const newAssets = [...allAssets];
        const index = newAssets.findIndex(a => a._pav_id === updatedAsset._pav_id);
        
        if (index !== -1) {
            const finalAsset = { ...updatedAsset, _pav_edited: true };

            if (engineerName) finalAsset.engineerName = engineerName;
            if (pavDate && finalAsset.pavStatus !== 'Not Done' && !finalAsset.pavDate) {
                 finalAsset.pavDate = pavDate;
            }
            newAssets[index] = finalAsset;
            
            setAllAssets(newAssets);
        }
        
        setEditingAssetId(null);
        setToast({ message: 'Asset updated successfully', id: Date.now() });
    };

    const isDataLoaded = allAssets.length > 0;

    const paginatedAssets = useMemo(() => {
        return filteredAssets.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        );
    }, [filteredAssets, currentPage]);

    return (
        <div className="bg-base-200 dark:bg-base-dark-100 min-h-screen text-base-content dark:text-base-dark-content font-sans flex flex-col">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".xlsx, .csv"
            />
            <Header/>
            <main className="container mx-auto p-4 md:p-6 space-y-6 flex-grow">
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                )}
                
                {!isDataLoaded && !isLoading ? (
                    <WelcomeScreen onUploadClick={handleUploadClick} />
                ) : (
                    <>
                        <ActionButtons
                            onUploadClick={handleUploadClick}
                            onDownloadAll={handleDownloadAll}
                            onDownloadFiltered={handleDownloadFiltered}
                            onSave={handleSaveProgress}
                            isDataLoaded={isDataLoaded}
                            filteredAssetsCount={filteredAssets.length}
                        />
                        <Dashboard assets={allAssets} isLoading={isLoading && !isDataLoaded} />
                        <Controls 
                            engineerName={engineerName}
                            setEngineerName={setEngineerName}
                            pavDate={pavDate}
                            setPavDate={setPavDate}
                            assetTypes={assetTypes}
                            models={models}
                            onFilterChange={handleFilterChange}
                            onSearch={handleSearch}
                            filters={filters}
                        />
                        <AssetTable 
                            assets={paginatedAssets}
                            onEdit={setEditingAssetId}
                            sortConfig={sortConfig}
                            onSort={handleSort}
                            isLoading={isLoading}
                            totalFilteredCount={filteredAssets.length}
                            currentPage={currentPage}
                            itemsPerPage={ITEMS_PER_PAGE}
                        />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(filteredAssets.length / ITEMS_PER_PAGE)}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </main>
            <footer className="w-full text-center p-4 text-xs text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} Made by Rohil Kohli. All rights reserved.
            </footer>
            {editingAsset && (
                <EditModal
                    asset={editingAsset}
                    onClose={() => setEditingAssetId(null)}
                    onSave={handleSaveAsset}
                    engineerName={engineerName}
                />
            )}
            {isUploadConfirmOpen && (
                <ConfirmationModal
                    title="Replace Existing Data?"
                    message="Uploading a new file will replace all current assets and any changes you've made. Are you sure you want to proceed?"
                    onConfirm={handleConfirmUpload}
                    onClose={handleCancelUpload}
                />
            )}
            {toast && (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}

export default App;