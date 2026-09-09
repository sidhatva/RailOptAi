import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Wrench,
  Train,
  Layers,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Printer,
  Send,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { AffectedTrainsTable } from './AffectedTrainsTable';
import { useRailway } from '../../context/RailwayContext';

export const PlanResultCard = ({ plan, onApprove }) => {
  const { currentUser, addToast } = useRailway();
  const [activeTab, setActiveTab] = useState('REASONS'); // 'REASONS', 'TRAINS', 'TASKS'
  const [isApproving, setIsApproving] = useState(false);

  if (!plan) return null;

  const isApproved = plan.status === 'APPROVED_BY_CONTROLLER';

  const handleApprove = () => {
    setIsApproving(true);
    setTimeout(() => {
      onApprove(plan.planId);
      setIsApproving(false);
    }, 600);
  };

  const handlePrintDispatch = () => {
    window.print();
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1525] shadow-lg overflow-hidden">
      {/* Upper Status Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-railway-navy to-slate-900 text-white border-b border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-amber-400 font-bold tracking-wider">
                PLAN REF: {plan.planId}
              </span>
              <StatusBadge status={plan.status} size="xs" />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                {plan.blockTypeName}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Recommended Maintenance Window
            </h3>
            <p className="text-xs text-slate-300 font-mono">
              {plan.corridorName} • {plan.trackName} • {plan.section}
            </p>
          </div>

          {/* Window Badge & Score */}
          <div className="flex items-center gap-4">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-center min-w-[130px]">
              <div className="text-[10px] font-mono uppercase text-slate-400">Optimization Score</div>
              <div className="text-2xl font-black font-mono text-emerald-400">
                {plan.optimizationScore}<span className="text-xs text-emerald-600 font-normal">/100</span>
              </div>
              <div className="text-[9px] text-slate-400 font-mono mt-0.5">MILP Pareto Global Max</div>
            </div>

            <div className="bg-red-950/60 border border-red-800/80 rounded-xl p-3 text-center min-w-[170px]">
              <div className="text-[10px] font-mono uppercase text-amber-300 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
                Optimal Slot
              </div>
              <div className="text-lg font-bold font-mono text-white mt-0.5">
                {plan.windowStart} - {plan.windowEnd}
              </div>
              <div className="text-[10px] text-amber-400 font-mono font-semibold">
                Window: {plan.durationHours} Hours ({plan.scheduledDate})
              </div>
            </div>
          </div>
        </div>

        {/* 4 Telemetry Metrics */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80 text-xs font-mono">
          <div className="bg-white/5 rounded-lg p-2.5">
            <span className="text-slate-400 text-[10px]">Delay Avoided</span>
            <div className="text-base font-bold text-emerald-400">
              {plan.metrics?.delayMinutesAvoided || 152} mins
            </div>
            <span className="text-[9px] text-slate-400">vs isolated blocks</span>
          </div>

          <div className="bg-white/5 rounded-lg p-2.5">
            <span className="text-slate-400 text-[10px]">Punctuality Impact</span>
            <div className="text-base font-bold text-sky-400">
              {plan.metrics?.punctualityImpactPercent || -0.6}%
            </div>
            <span className="text-[9px] text-slate-400">Absorbed in slack</span>
          </div>

          <div className="bg-white/5 rounded-lg p-2.5">
            <span className="text-slate-400 text-[10px]">Machine Utilization</span>
            <div className="text-base font-bold text-amber-400">
              {plan.metrics?.machineUtilizationPercent || 94.2}%
            </div>
            <span className="text-[9px] text-slate-400">Zero idle track time</span>
          </div>

          <div className="bg-white/5 rounded-lg p-2.5">
            <span className="text-slate-400 text-[10px]">Shadow Bundling</span>
            <div className="text-base font-bold text-purple-400">
              {plan.assignedTasks?.length || 2} Depts Combined
            </div>
            <span className="text-[9px] text-slate-400">Track + OHE + S&T</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/40">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('REASONS')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'REASONS'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Reasoning & Justification ({plan.aiReasons?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('TRAINS')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'TRAINS'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Train className="w-3.5 h-3.5" />
            Affected Trains & Regulation ({plan.affectedTrains?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('TASKS')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'TASKS'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            Assigned Work Orders ({plan.assignedTasks?.length || 0})
          </button>
        </div>

        {/* Approval info if already approved */}
        {isApproved && (
          <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved by {plan.approvedBy}
          </div>
        )}
      </div>

      {/* Tab Contents */}
      <div className="p-6">
        {activeTab === 'REASONS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.aiReasons?.map((reason, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111A2E] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">
                      {reason.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                      {reason.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {reason.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Confidence Metric</span>
                  <span className="text-emerald-500 font-bold">{reason.confidence}% Satisfied</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'TRAINS' && (
          <AffectedTrainsTable affectedTrains={plan.affectedTrains} />
        )}

        {activeTab === 'TASKS' && (
          <div className="space-y-3">
            {plan.assignedTasks?.map((task) => (
              <div
                key={task.taskId}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111A2E] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                      {task.taskId}
                    </span>
                    <StatusBadge status={task.dept} size="xs" />
                  </div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    {task.title}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Track Machine: <strong>{task.machine}</strong> • Crew Size: <strong>{task.crew} Personnel</strong>
                  </div>
                </div>

                <div className="sm:text-right font-mono text-xs">
                  <span className="text-slate-400 text-[10px] block">Allocated Slot</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {task.allocatedWindow}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Controls & Approval Action */}
      <div className="p-4 sm:px-6 bg-slate-50 dark:bg-[#090E1A] border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Compliant with Indian Railways General & Subsidiary Rules (G&SR)</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrintDispatch}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Block Order
          </button>

          {!isApproved ? (
            <button
              onClick={handleApprove}
              disabled={isApproving}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-700 to-railway-maroon hover:from-red-600 hover:to-red-700 text-white text-xs font-bold shadow-md shadow-red-950/30 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {isApproving ? 'Transmitting to COIS...' : 'Approve & Transmit to COIS'}
            </button>
          ) : (
            <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-mono font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              BLOCK DISPATCHED TO CONTROL OFFICE
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
