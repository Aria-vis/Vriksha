import { useState, useEffect, useCallback } from 'react';
import { offlineDb, PendingPlantSubmission, PendingVerification } from '../lib/db';
import { plantsApi } from '../services/plantsApi';
import { PlantItem } from '../types/plant';

export interface OfflineQueueState {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncedAt: Date | null;
  queueSubmission: (submission: Omit<PendingPlantSubmission, 'id' | 'createdAt' | 'status'>) => Promise<number>;
  queueVerification: (verification: Omit<PendingVerification, 'id' | 'createdAt' | 'status'>) => Promise<number>;
  syncNow: () => Promise<{ success: boolean; syncedCount: number; failedCount: number }>;
}

export function useOfflineQueue(): OfflineQueueState {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // Refresh counts of queued items
  const refreshPendingCount = useCallback(async () => {
    try {
      const subsCount = await offlineDb.pendingSubmissions
        .where('status')
        .equals('pending')
        .count();
      const verifsCount = await offlineDb.pendingVerifications
        .where('status')
        .equals('pending')
        .count();
      setPendingCount(subsCount + verifsCount);
    } catch (err) {
      console.warn('Could not read Dexie offline queue counts:', err);
    }
  }, []);

  // Sync now function
  const syncNow = useCallback(async (): Promise<{ success: boolean; syncedCount: number; failedCount: number }> => {
    if (!navigator.onLine || isSyncing) {
      return { success: false, syncedCount: 0, failedCount: 0 };
    }

    setIsSyncing(true);
    let synced = 0;
    let failed = 0;

    try {
      // 1. Process pending submissions
      const pendingSubs = await offlineDb.pendingSubmissions
        .where('status')
        .equals('pending')
        .toArray();

      for (const item of pendingSubs) {
        try {
          await offlineDb.pendingSubmissions.update(item.id!, { status: 'syncing' });
          
          await plantsApi.addPlant({
            species_id: item.speciesId,
            lat: item.lat,
            lng: item.lng,
            land_type: item.landType,
            address_hint: item.addressHint,
            notes: item.notes,
            private_owner_consent: item.privateOwnerConsent,
            photo_data_url: item.photoDataUrl,
          });

          await offlineDb.pendingSubmissions.update(item.id!, { status: 'synced' });
          synced++;
        } catch (subErr) {
          console.error('Failed to sync plant submission:', subErr);
          await offlineDb.pendingSubmissions.update(item.id!, {
            status: 'failed',
            errorMessage: (subErr as Error).message,
          });
          failed++;
        }
      }

      // 2. Process pending verifications
      const pendingVerifs = await offlineDb.pendingVerifications
        .where('status')
        .equals('pending')
        .toArray();

      for (const verif of pendingVerifs) {
        try {
          await offlineDb.pendingVerifications.update(verif.id!, { status: 'syncing' });

          if (verif.verificationType === 'still_here') {
            await plantsApi.verifyPlant(verif.plantId, 'still_here', verif.userLat, verif.userLng);
          } else {
            await plantsApi.reportPlant(verif.plantId, 'gone', verif.details || 'Reported gone offline');
          }

          await offlineDb.pendingVerifications.update(verif.id!, { status: 'synced' });
          synced++;
        } catch (verifErr) {
          console.error('Failed to sync verification:', verifErr);
          await offlineDb.pendingVerifications.update(verif.id!, {
            status: 'failed',
            errorMessage: (verifErr as Error).message,
          });
          failed++;
        }
      }

      setLastSyncedAt(new Date());
      await refreshPendingCount();
      return { success: failed === 0, syncedCount: synced, failedCount: failed };
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, refreshPendingCount]);

  // Online / offline event listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncNow();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    refreshPendingCount();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncNow, refreshPendingCount]);

  const queueSubmission = async (
    submission: Omit<PendingPlantSubmission, 'id' | 'createdAt' | 'status'>
  ): Promise<number> => {
    const record: PendingPlantSubmission = {
      ...submission,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    const id = await offlineDb.pendingSubmissions.add(record);
    await refreshPendingCount();

    // Cache optimistic plant locally so user sees it right away
    const optimisticPlant: PlantItem = {
      id: submission.tempId,
      species_id: submission.speciesId || 'unknown',
      scientific_name: submission.customSpeciesName || submission.speciesName,
      common_name_en: submission.speciesName,
      common_name_hi: submission.speciesName,
      plant_type: 'large_tree',
      use_tags: ['puja', 'medicinal'],
      parts_used: ['leaves'],
      is_toxic: false,
      toxicity_details: null,
      lat: submission.lat,
      lng: submission.lng,
      distance_meters: 10,
      address_hint: submission.addressHint || null,
      land_type: submission.landType,
      status: 'recently_verified',
      last_verified_at: new Date().toISOString(),
      verification_count: 1,
      is_sacred_heritage: false,
      heritage_story: null,
      is_restricted: false,
      primary_photo_url: submission.photoDataUrl || null,
      source: 'community',
      attribution: 'Local Contributor (Offline queued)',
      license: 'CC BY-SA 4.0',
    };
    await offlineDb.cachedPlants.put(optimisticPlant);

    // If online, trigger background sync
    if (navigator.onLine) {
      setTimeout(() => syncNow(), 500);
    }

    return id;
  };

  const queueVerification = async (
    verification: Omit<PendingVerification, 'id' | 'createdAt' | 'status'>
  ): Promise<number> => {
    const record: PendingVerification = {
      ...verification,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    const id = await offlineDb.pendingVerifications.add(record);
    await refreshPendingCount();

    // If online, trigger background sync
    if (navigator.onLine) {
      setTimeout(() => syncNow(), 500);
    }

    return id;
  };

  return {
    isOnline,
    isSyncing,
    pendingCount,
    lastSyncedAt,
    queueSubmission,
    queueVerification,
    syncNow,
  };
}
