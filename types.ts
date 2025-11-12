export interface Asset {
  [key: string]: any; // Allow for dynamic keys from Excel sheet
  _pav_id: string;
  _pav_edited?: boolean;
  'Asset Code': string;
  'Serial Number': string;
  'Make': string;
  'Model': string;
  'Asset Type': string;
  'Branch code'?: string;
  'Branch Name': string;
  'Hub'?: string;
  'Status'?: string;
  'Sub status'?: string;
  'Primary Owner'?: string;
  'Secondary owner'?: string;
  'Warranty Start Date'?: string;
  'Warranty End Date'?: string;
  'Same Asset or Additional Found Asset'?: string;

  // App-specific fields
  pavStatus: PAVStatus;
  assetStatus: AssetStatus | '';
  assetAvailabilityRemarks: AssetAvailabilityRemarks | '';
  newBranchCode: string;
  disposalTicket: string;
  otherRemarks: string;
  engineerName: string;
  pavDate: string;
}

export enum PAVStatus {
  Available = 'Available',
  NotAvailable = 'Not Available',
  NotDone = 'Not Done',
}

export enum AssetStatus {
  InUse = 'In Use',
  NotInUse = 'Not In Use',
  NotFound = 'Not Found',
}

export enum AssetAvailabilityRemarks {
  SameBranch = 'Available in same branch',
  DifferentBranch = 'Available in different branch',
  DisposalVendor = 'Asset picked up by disposal vendor',
  Other = 'Other',
}

export type SortConfig = {
  key: keyof Asset;
  direction: 'ascending' | 'descending';
} | null;