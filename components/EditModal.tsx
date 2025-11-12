import React, { useState, useEffect } from 'react';
import { Asset, AssetStatus, PAVStatus, AssetAvailabilityRemarks } from '../types';
import { CloseIcon } from './icons';

interface EditModalProps {
    asset: Asset;
    onClose: () => void;
    onSave: (updatedAsset: Asset) => void;
    engineerName: string;
}

const EditModal: React.FC<EditModalProps> = ({ asset, onClose, onSave, engineerName }) => {
    const [formData, setFormData] = useState(asset);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        setFormData(asset);
        setError('');
    }, [asset]);

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

    const isBranchCodeMandatory = formData.assetAvailabilityRemarks === AssetAvailabilityRemarks.DifferentBranch;
    const isDisposalMandatory = formData.assetAvailabilityRemarks === AssetAvailabilityRemarks.DisposalVendor;
    const isOtherRemarksMandatory = formData.assetAvailabilityRemarks === AssetAvailabilityRemarks.Other;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        let updatedFormData = { ...formData, [name]: value };

        if (name === 'assetAvailabilityRemarks') {
            updatedFormData.newBranchCode = value === AssetAvailabilityRemarks.DifferentBranch ? '' : 'N/A';
            updatedFormData.disposalTicket = value === AssetAvailabilityRemarks.DisposalVendor ? 'RITM' : 'N/A';
            updatedFormData.otherRemarks = value === AssetAvailabilityRemarks.Other ? '' : '';
        }

        if (name === 'disposalTicket' && value.startsWith('RITM')) {
            const numericPart = value.substring(4).replace(/\D/g, '');
            updatedFormData.disposalTicket = `RITM${numericPart}`;
        }
        
        setFormData(updatedFormData);
    };
    
    const handleSave = () => {
        setError('');

        if (!engineerName || engineerName.trim() === '') {
            setError('Auditor Name is required. Please close this window and enter it in the field at the top of the page before saving.');
            return;
        }

        if (
            (!formData['Asset Code'] || String(formData['Asset Code']).trim() === '') &&
            (!formData['Serial Number'] || String(formData['Serial Number']).trim() === '')
        ) {
            setError('Asset must have either an Asset Code or a Serial Number.');
            return;
        }

        if (isBranchCodeMandatory && (!formData.newBranchCode || formData.newBranchCode.trim() === '' || formData.newBranchCode.trim() === 'N/A')) {
            setError('New Branch Code is required for this remark.');
            return;
        }

        if (isDisposalMandatory) {
            const ticketNumber = formData.disposalTicket.replace('RITM', '').trim();
            if (!/^\d{7}$/.test(ticketNumber)) {
                setError('Disposal Ticket must be "RITM" followed by exactly 7 digits.');
                return;
            }
        }
        
        if (isOtherRemarksMandatory && (!formData.otherRemarks || formData.otherRemarks.trim() === '')) {
            setError("Custom Comment is required for 'Other' remark.");
            return;
        }

        const finalAsset: Asset = {
            ...formData,
            pavStatus: (formData.pavStatus === PAVStatus.Available || formData.pavStatus === PAVStatus.NotAvailable) ? formData.pavStatus : PAVStatus.NotDone,
        };
        onSave(finalAsset);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center" onClick={onClose}>
            <div className="bg-base-100 dark:bg-base-dark-200 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-in-up" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-base-300 dark:border-gray-700 sticky top-0 bg-base-100 dark:bg-base-dark-200 z-10 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-base-content dark:text-base-dark-300">Edit Asset</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-base-200 dark:hover:bg-base-dark-100 transition">
                        <CloseIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Asset Code</label>
                            <input
                                type="text"
                                name="Asset Code"
                                value={formData['Asset Code'] || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Serial Number</label>
                            <input
                                type="text"
                                name="Serial Number"
                                value={formData['Serial Number'] || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full input-field"
                            />
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-base-200 dark:bg-base-dark-100 rounded-md text-sm">
                        <h4 className="font-semibold mb-2 text-base-content dark:text-base-dark-300">Additional Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-gray-700 dark:text-gray-300">
                           <p><strong className="text-gray-500 dark:text-gray-400">Asset Type:</strong> {asset['Asset Type']}</p>
                           <p><strong className="text-gray-500 dark:text-gray-400">Make:</strong> {asset['Make']}</p>
                           <p><strong className="text-gray-500 dark:text-gray-400">Model:</strong> {asset['Model']}</p>
                           <p><strong className="text-gray-500 dark:text-gray-400">Branch Name:</strong> {asset['Branch Name']}</p>
                        </div>
                    </div>

                    <hr className="dark:border-gray-700"/>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Asset Status</label>
                            <select name="assetStatus" value={formData.assetStatus} onChange={handleChange} className="mt-1 block w-full input-field">
                                <option value="">Select...</option>
                                {Object.values(AssetStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">PAV Status</label>
                            <select name="pavStatus" value={formData.pavStatus} onChange={handleChange} className="mt-1 block w-full input-field">
                                <option value="">Select...</option>
                                <option value={PAVStatus.Available}>Available</option>
                                <option value={PAVStatus.NotAvailable}>Not Available</option>
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium">Asset Availability Remarks</label>
                        <select name="assetAvailabilityRemarks" value={formData.assetAvailabilityRemarks} onChange={handleChange} className="mt-1 block w-full input-field">
                            <option value="">Select...</option>
                            {Object.values(AssetAvailabilityRemarks).map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    
                    {isBranchCodeMandatory && (
                        <div className="animate-fade-in">
                            <label className="block text-sm font-medium">New Branch Code <span className="text-red-500">*</span></label>
                            <input type="text" name="newBranchCode" value={formData.newBranchCode} onChange={handleChange} className="mt-1 block w-full input-field" placeholder="Enter New Branch Code"/>
                        </div>
                    )}
                    {isDisposalMandatory && (
                         <div className="animate-fade-in">
                            <label className="block text-sm font-medium">Disposal Ticket <span className="text-red-500">*</span></label>
                             <div className="flex items-center mt-1">
                                 <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-500 text-sm">RITM</span>
                                 <input type="text" name="disposalTicket" value={formData.disposalTicket.replace('RITM', '')} onChange={handleChange} maxLength={7} className="w-full input-field rounded-l-none" placeholder="7 numeric characters"/>
                             </div>
                        </div>
                    )}
                    {isOtherRemarksMandatory && (
                        <div className="animate-fade-in">
                            <label className="block text-sm font-medium">Custom Comment <span className="text-red-500">*</span></label>
                            <textarea name="otherRemarks" value={formData.otherRemarks} onChange={handleChange} rows={3} className="mt-1 block w-full input-field" placeholder="Enter details..."></textarea>
                        </div>
                    )}
                </div>
                <div className="p-6 bg-base-200 dark:bg-base-dark-100 border-t border-base-300 dark:border-gray-700 sticky bottom-0 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition">Save Changes</button>
                </div>
                 <style>{`
                    .input-field {
                        background-color: #F3F4F6; /* bg-gray-100 */
                        border: 1px solid #D1D5DB; /* border-gray-300 */
                        border-radius: 0.375rem; /* rounded-md */
                        padding: 0.5rem 0.75rem;
                        transition: border-color 0.2s, box-shadow 0.2s;
                    }
                    .input-field:focus {
                        outline: none;
                        border-color: #3B82F6; /* focus:border-primary-500 */
                        box-shadow: 0 0 0 1px #3B82F6; /* focus:ring-primary-500 */
                    }
                    .dark .input-field {
                        background-color: #1F2937; /* dark:bg-gray-800 */
                        border-color: #4B5563; /* dark:border-gray-600 */
                        color: #F9FAFB; /* dark:text-gray-50 */
                    }
                `}</style>
            </div>
        </div>
    );
};

export default EditModal;