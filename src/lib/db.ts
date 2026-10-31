import Dexie, { type Table } from 'dexie';
import { PlantItem } from '../types/plant';

export interface PendingPlantSubmission {
  id?: number;
  tempId: string;
  speciesId?: string;
  speciesName: string;
  customSpeciesName?: string;
  lat: number;
  lng: number;
  addressHint: string;
  landType: 'public' | 'temple' | 'institution' | 'private';
  privateOwnerConsent: boolean;
  notes?: string;
  photoDataUrl?: string;
  photoBlob?: Blob;
  createdAt: string;
  status: 'pending' | 'syncing' | 'failed' | 'synced';
  errorMessage?: string;
}

export interface PendingVerification {
  id?: number;
  plantId: string;
  speciesName?: string;
  verificationType: 'still_here' | 'it_is_gone';
  userLat?: number;
  userLng?: number;
  details?: string;
  createdAt: string;
  status: 'pending' | 'syncing' | 'failed' | 'synced';
  errorMessage?: string;
}

export class VrikshaDatabase extends Dexie {
  pendingSubmissions!: Table<PendingPlantSubmission, number>;
  pendingVerifications!: Table<PendingVerification, number>;
  cachedPlants!: Table<PlantItem, string>;

  constructor() {
    super('VrikshaOfflineDB');
    this.version(1).stores({
      pendingSubmissions: '++id, tempId, status, createdAt',
      pendingVerifications: '++id, plantId, verificationType, status, createdAt',
      cachedPlants: 'id, scientific_name, common_name_en, common_name_hi, status, distance_meters',
    });
  }
}

export const offlineDb = new VrikshaDatabase();
