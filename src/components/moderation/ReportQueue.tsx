import React, { useState } from 'react';
import { Check, Trash2, ShieldAlert } from 'lucide-react';

export interface ModerationReportItem {
  id: string;
  plantId: string;
  plantName: string;
  scientificName: string;
  reportType: 'gone' | 'wrong_species' | 'private_property_violation' | 'spam';
  details: string;
  reportedBy: string;
  reportedAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

const INITIAL_MOCK_REPORTS: ModerationReportItem[] = [
  {
    id: 'rep-001',
    plantId: 'd0000001-0000-0000-0000-000000000001',
    plantName: 'Bael (बेल)',
    scientificName: 'Aegle marmelos',
    reportType: 'gone',
    details: 'Tree was cut down during road widening project last week.',
    reportedBy: 'VaranasiResident',
    reportedAt: '2026-10-30T10:15:00Z',
    status: 'pending',
  },
  {
    id: 'rep-002',
    plantId: 'd0000001-0000-0000-0000-000000000002',
    plantName: 'White Sandalwood (चंदन)',
    scientificName: 'Santalum album',
    reportType: 'private_property_violation',
    details: 'This tree is inside an enclosed residential compound. Please remove or mask.',
    reportedBy: 'HomeownerSunil',
    reportedAt: '2026-10-31T08:30:00Z',
    status: 'pending',
  },
  {
    id: 'rep-003',
    plantId: 'd0000001-0000-0000-0000-000000000004',
    plantName: 'Neem (नीम)',
    scientificName: 'Azadirachta indica',
    reportType: 'wrong_species',
    details: 'Leaves look more like Bakayan (Melia azedarach / Persian Lilac) than true Neem.',
    reportedBy: 'BotanistRamesh',
    reportedAt: '2026-10-31T11:45:00Z',
    status: 'pending',
  },
];

interface ReportQueueProps {
  onResolveReport?: (reportId: string, action: 'approved' | 'dismissed') => void;
}

export const ReportQueue: React.FC<ReportQueueProps> = ({ onResolveReport }) => {
  const [reports, setReports] = useState<ModerationReportItem[]>(INITIAL_MOCK_REPORTS);

  const handleAction = (reportId: string, action: 'approved' | 'dismissed') => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: action === 'approved' ? 'resolved' : 'dismissed' } : r))
    );
    onResolveReport?.(reportId, action);
  };

  const pendingReports = reports.filter((r) => r.status === 'pending');

  const getReportTypeBadge = (type: ModerationReportItem['reportType']) => {
    switch (type) {
      case 'gone':
        return <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded font-semibold text-[10px]">TREE GONE</span>;
      case 'private_property_violation':
        return <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-semibold text-[10px]">PRIVATE PROPERTY</span>;
      case 'wrong_species':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-semibold text-[10px]">WRONG SPECIES</span>;
      case 'spam':
        return <span className="px-2 py-0.5 bg-stone-200 text-stone-800 rounded font-semibold text-[10px]">SPAM</span>;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
        <span className="font-semibold flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>Pending Community Reports ({pendingReports.length})</span>
        </span>
        <span className="text-[11px] text-stone-400">Decisions logged to audit trail</span>
      </div>

      {pendingReports.length === 0 ? (
        <div className="py-12 text-center text-xs text-stone-500 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200 dark:border-stone-800">
          <Check className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <p className="font-semibold text-stone-800 dark:text-stone-200">Moderation Queue is Clean!</p>
          <p className="text-[11px] text-stone-500 mt-0.5">All flagged reports have been investigated and resolved.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {pendingReports.map((report) => (
            <div
              key={report.id}
              className="p-3.5 bg-white dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">{report.plantName}</h4>
                    {getReportTypeBadge(report.reportType)}
                  </div>
                  <p className="text-[11px] text-stone-500 italic font-sans">{report.scientificName}</p>
                </div>
                <span className="text-[10px] text-stone-400">
                  {new Date(report.reportedAt).toLocaleDateString()}
                </span>
              </div>

              <div className="p-2 bg-stone-50 dark:bg-stone-800/90 rounded-xl border border-stone-100 dark:border-stone-700/60 text-xs text-stone-700 dark:text-stone-300 space-y-1">
                <div className="text-[10px] text-stone-400 font-semibold uppercase">
                  Reported by @{report.reportedBy}:
                </div>
                <p className="leading-relaxed">&ldquo;{report.details}&rdquo;</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleAction(report.id, 'dismissed')}
                    className="px-3 py-1.5 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 font-medium"
                  >
                    Dismiss False Report
                  </button>
                  <button
                    onClick={() => handleAction(report.id, 'approved')}
                    className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-lg font-semibold flex items-center gap-1 shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Approve &amp; Take Down</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportQueue;
