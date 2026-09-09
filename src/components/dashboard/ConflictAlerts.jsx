import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const ConflictAlerts = () => {
  const conflicts = [
    {
      id: 'CONF-01',
      title: 'Traffic Block vs 12582 Banaras - NDLS SF',
      severity: 'HIGH',
      location: 'Aligarh - Tundla (Km 164/20)',
      timeWindow: '03:10 IST',
      conflictType: 'TRACK_POSSESSION_OVERLAP',
      aiResolution: 'AI Regulates Train 12582 at Hathras Jn Loop 2 for 14 mins. Slack recovery buffer at GZB ensures 0 arrival delay.',
      status: 'RESOLVED_BY_AI',
      confidence: '98%'
    },
    {
      id: 'CONF-02',
      title: 'Power Block (25kV OHE Isolation) vs Freight Rake BCN-92',
      severity: 'MEDIUM',
      location: 'Tundla Yard Outer',
      timeWindow: '02:30 IST',
      conflictType: 'TRACTION_POWER_CUT',
      aiResolution: 'Electric loco halted at Tundla Goods Loop prior to neutral section trip. Diesel shunter on standby.',
      status: 'STAGED',
      confidence: '94%'
    }
  ];

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1626] p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Live Conflict & Safety Telemetry
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Real-time detection of block overlapping with scheduled train paths
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          2 Conflicts Mitigated
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {conflicts.map((conf) => (
          <div
            key={conf.id}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#111A2E] hover:border-slate-300 dark:hover:border-slate-700 transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                    {conf.title}
                  </span>
                  <StatusBadge status={conf.severity} size="xs" />
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  Location: {conf.location} • Slot: {conf.timeWindow}
                </div>
              </div>

              <span className="text-[10px] font-mono text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                AI Confidence: {conf.confidence}
              </span>
            </div>

            <div className="mt-2.5 p-2.5 rounded-lg bg-white dark:bg-[#0A101D] border border-slate-100 dark:border-slate-800 text-xs flex items-start gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-700 dark:text-slate-300">
                <strong className="text-amber-500 font-mono">AI Mitigation: </strong>
                {conf.aiResolution}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
