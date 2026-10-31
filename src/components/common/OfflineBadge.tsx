import React from 'react';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useOfflineQueue } from '../../hooks/useOfflineQueue';

export const OfflineBadge: React.FC = () => {
  const { isOnline, isSyncing, pendingCount, syncNow } = useOfflineQueue();

  // If online and nothing is pending or syncing, do not clutter UI
  if (isOnline && pendingCount === 0 && !isSyncing) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-4 z-40 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full shadow-lg border border-amber-200 text-xs font-medium">
        {!isOnline ? (
          <>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <WifiOff className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-gray-800">
              Offline mode {pendingCount > 0 && `• ${pendingCount} queued`}
            </span>
          </>
        ) : isSyncing ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 text-forest-600 animate-spin" />
            <span className="text-forest-800">Syncing changes...</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-gray-700">{pendingCount} queued</span>
            <button
              onClick={() => syncNow()}
              className="text-forest-700 font-semibold hover:underline ml-1"
            >
              Sync now
            </button>
          </>
        )}
      </div>
    </div>
  );
};
