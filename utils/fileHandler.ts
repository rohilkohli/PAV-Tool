import { Asset } from '../types';

declare const XLSX: any;

/**
 * Safely gets a value from a row object by trying multiple possible keys.
 * @param row The row object from the sheet.
 * @param keys An array of possible keys to check for.
 * @param defaultValue The value to return if no key is found.
 * @returns The found value or the default.
 */
const getValue = (row: any, keys: string[], defaultValue: any = '') => {
  for (const key of keys) {
    const lowerKey = key.toLowerCase();
    for(const rowKey in row){
        if(rowKey.toLowerCase() === lowerKey){
            if (row[rowKey] != null) {
                return row[rowKey];
            }
        }
    }
  }
  return defaultValue;
};


export const readDataFromFile = (file: File): Promise<{assets: Asset[], headers: string[]}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const headerRows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const headers: string[] = headerRows.length > 0 ? headerRows[0].map(h => String(h)) : [];

        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

        const assets: Asset[] = jsonData.map((row, index) => {
            const assetCode = getValue(row, ['Asset Code', 'Asset_Code', 'asset code'], '');
            const serialNumber = getValue(row, ['Serial Number', 'Serial_Number', 'serial number'], '');

            const existingPavStatus = getValue(row, ['pavStatus', 'PV Status', 'PAV Status'], 'Not Done');
            let initialPavStatus = 'Not Done';

            if (String(existingPavStatus).trim().toLowerCase() === 'available') {
                initialPavStatus = 'Available';
            } else if (String(existingPavStatus).trim().toLowerCase() === 'not available') {
                initialPavStatus = 'Not Available';
            }

            const timestamp = Date.now();
            const random = Math.random().toString(36).slice(2, 9);
            let pavId = `asset-${index}-${timestamp}-${random}`;
            if (assetCode) {
                pavId = `${String(assetCode)}-${index}-${timestamp}-${random}`;
            } else if (serialNumber) {
                pavId = `${String(serialNumber)}-${index}-${timestamp}-${random}`;
            }
            
            const rawAssetStatus = String(getValue(row, ['assetStatus', 'Asset Status', 'Asset status'], '')).trim().toLowerCase();
            let initialAssetStatus: any = '';
            if (rawAssetStatus === 'in use') initialAssetStatus = 'In Use';
            else if (rawAssetStatus === 'not in use') initialAssetStatus = 'Not In Use';
            else if (rawAssetStatus === 'not found') initialAssetStatus = 'Not Found';

            const rawRemarks = String(getValue(row, ['assetAvailabilityRemarks', 'Asset Availability Remarks'], '')).trim().toLowerCase();
            let initialRemarks: any = '';
            if (rawRemarks === 'available in same branch') initialRemarks = 'Available in same branch';
            else if (rawRemarks === 'available in different branch') initialRemarks = 'Available in different branch';
            else if (rawRemarks === 'asset picked up by disposal vendor') initialRemarks = 'Asset picked up by disposal vendor';
            else if (rawRemarks === 'other') initialRemarks = 'Other';

            const mappedAsset: Partial<Asset> = {
                _pav_id: pavId,
                'Asset Code': assetCode,
                'Serial Number': serialNumber,
                'Make': getValue(row, ['Make'], ''),
                'Model': getValue(row, ['Model'], ''),
                'Asset Type': getValue(row, ['Asset Type'], ''),
                'Branch code': getValue(row, ['Branch code', 'Branch Code'], ''),
                'Branch Name': getValue(row, ['Branch Name'], ''),
                'Hub': getValue(row, ['Hub'], ''),
                'Status': getValue(row, ['Status'], ''),
                'Sub status': getValue(row, ['Sub status', 'Sub Status'], ''),
                'Primary Owner': getValue(row, ['Primary Owner'], ''),
                'Secondary owner': getValue(row, ['Secondary owner', 'Secondary Owner'], ''),
                'Warranty Start Date': getValue(row, ['Warranty Start Date'], ''),
                'Warranty End Date': getValue(row, ['Warranty End Date'], ''),
                'Same Asset or Additional Found Asset': getValue(row, ['Same Asset or Additional Found Asset'], ''),
                pavStatus: initialPavStatus as any,
                assetStatus: initialAssetStatus,
                assetAvailabilityRemarks: initialRemarks,
                newBranchCode: getValue(row, ['newBranchCode', 'New Branch Code'], ''),
                disposalTicket: getValue(row, ['disposalTicket', 'Disposal Ticket'], ''),
                otherRemarks: getValue(row, ['otherRemarks', 'Other Remarks', 'Comment', 'Comments'], ''),
                engineerName: getValue(row, ['engineerName', 'Engineer Name', 'Audited By'], ''),
                pavDate: getValue(row, ['pavDate', 'PAV Date', 'PV Date', 'Audit Date', 'PAV Date of visit (DD-MMM-YYYY i.e: 15-Mar-2021)'], ''),
            };

            return {
                ...row,
                ...mappedAsset,
            } as Asset;
        });
        resolve({assets, headers});
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};

export const writeDataToFile = (assets: Asset[], originalHeaders: string[], fileName: string = 'verified_assets.xlsx') => {
    // This function prepares data for export. It ensures that the exported file has the *exact* same columns
    // as the original uploaded file, preserving the column order and only updating the values.
    // No new columns are added, and internal fields (like _pav_id) are removed.

    const keyMap: { [key: string]: string[] } = {
        'pavStatus': ['pavStatus', 'PV Status', 'PAV Status'],
        'assetStatus': ['assetStatus', 'Asset Status', 'Asset status'],
        'assetAvailabilityRemarks': ['assetAvailabilityRemarks', 'Asset Availability Remarks'],
        'newBranchCode': ['newBranchCode', 'New Branch Code'],
        'disposalTicket': ['disposalTicket', 'Disposal Ticket'],
        'otherRemarks': ['otherRemarks', 'Other Remarks', 'Comment', 'Comments'],
        'engineerName': ['engineerName', 'Engineer Name', 'Audited By'],
        'pavDate': ['pavDate', 'PAV Date', 'PV Date', 'Audit Date', 'PAV Date of visit (DD-MMM-YYYY i.e: 15-Mar-2021)']
    };
    
    // Create a reverse map for efficient lookup: originalHeader.toLowerCase() -> appKey
    const reverseKeyMap: { [key: string]: keyof Asset } = {};
    for (const appKey in keyMap) {
        keyMap[appKey as keyof typeof keyMap].forEach(header => {
            reverseKeyMap[header.toLowerCase()] = appKey as keyof Asset;
        });
    }

    const assetsToExport = assets.map(asset => {
        const exportRow: { [key: string]: any } = {};

        originalHeaders.forEach(header => {
            const lowerHeader = header.toLowerCase();
            const appKey = reverseKeyMap[lowerHeader];

            if (appKey) {
                // This column is managed by the app, so we use the app's normalized value.
                exportRow[header] = asset[appKey];
            } else {
                // This is an original column not directly managed by the app's core logic.
                // We use the value directly from the asset object.
                 exportRow[header] = asset[header as keyof Asset];
            }
        });
        return exportRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(assetsToExport, { header: originalHeaders });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Verified Assets');
    XLSX.writeFile(workbook, fileName);
};
