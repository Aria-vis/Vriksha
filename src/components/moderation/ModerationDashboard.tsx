import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  GitMerge,
  BookOpen,
  History,
} from 'lucide-react';
import { ReportQueue } from './ReportQueue';
import { DuplicateMergeTool } from './DuplicateMergeTool';
import { SpeciesManagement } from './SpeciesManagement';
import { PlantSearchResult, Species } from '../../types/plant';

interface ModerationDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  plants: PlantSearchResult[];
  speciesList: Species[];
}

export const ModerationDashboard: React.FC<ModerationDashboardProps> = ({
  isOpen,
  onClose,
  plants,
  speciesList,
}) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'duplicates' | 'species' | 'audit'>('reports');
  const [auditLog, setAuditLog] = useState<Array<{ id: string; action: string; time: string; details: string }>>([
    {
      id: 'log-1',
      action: 'Species Fuzzing Enforced',
      time: '2026-10-31 09:30',
      details: 'Automatic ~5 km centroid applied to Santalum album (White Sandalwood)',
    },
    {
      id: 'log-2',
      action: 'Duplicate Merge',
      time: '2026-10-30 16:45',
      details: 'Merged 2 duplicate Bael records in Varanasi Sector 4 (dist = 8m)',
    },
  ]);

  if (!isOpen) return null;

  const logModerationAction = (action: string, details: string) => {
    setAuditLog((prev) => [
      {
        id: `log-${Date.now()}`,
        action,
        time: new Date().toISOString().replace('T', ' ').slice(0, 16),
        details,
      },
      ...prev,
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl overflow-hidden border border-amber-200 dark:border-stone-800 flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 to-forest-950 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700/60 flex items-center justify-center text-amber-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif tracking-tight">Community Moderation</h2>
                <span className="px-2 py-0.2 bg-amber-400 text-stone-950 text-[10px] font-bold rounded-full">
                  Admin / Mod
                </span>
              </div>
              <p className="text-xs text-stone-300">
                Ground-truth accuracy, duplicate cleanup &amp; species protection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-stone-200 dark:border-stone-800 px-4 bg-stone-50 dark:bg-stone-800/60 text-xs font-semibold overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'reports'
                ? 'border-forest-700 text-forest-800 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Reports Queue</span>
          </button>

          <button
            onClick={() => setActiveTab('duplicates')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'duplicates'
                ? 'border-forest-700 text-forest-800 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <GitMerge className="w-4 h-4 text-emerald-600" />
            <span>Duplicate Cleanup</span>
          </button>

          <button
            onClick={() => setActiveTab('species')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'species'
                ? 'border-forest-700 text-forest-800 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span>Species Shield</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'audit'
                ? 'border-forest-700 text-forest-800 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <History className="w-4 h-4 text-stone-500" />
            <span>Audit Trail</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {activeTab === 'reports' && (
            <ReportQueue
              onResolveReport={(repId, action) =>
                logModerationAction(`Report ${repId}`, `${action === 'approved' ? 'Approved & resolved' : 'Dismissed'}`)
              }
            />
          )}

          {activeTab === 'duplicates' && (
            <DuplicateMergeTool
              plants={plants}
              onMerge={(canonicalId, duplicateId) =>
                logModerationAction('Duplicate Merge', `Merged duplicate ${duplicateId} into canonical ${canonicalId}`)
              }
            />
          )}

          {activeTab === 'species' && (
            <SpeciesManagement
              speciesList={speciesList}
              onToggleRestricted={(spId, restricted) =>
                logModerationAction('Species Shield Updated', `Species ${spId} restricted=${restricted}`)
              }
            />
          )}

          {activeTab === 'audit' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
                <span className="font-semibold">Recent Moderation Actions</span>
                <span className="text-[11px] text-stone-400">Append-only audit ledger</span>
              </div>

              <div className="space-y-2">
                {auditLog.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-800 text-xs space-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-800 dark:text-stone-200">{log.action}</span>
                      <span className="text-[10px] text-stone-400 font-mono">{log.time}</span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-800 shrink-0 flex items-center justify-between">
          <p className="text-[11px] text-stone-500">
            Changes take immediate effect across public queries and API responses.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-semibold"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModerationDashboard;
