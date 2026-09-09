import React from 'react';
import { useRailway } from '../context/RailwayContext';
import {
  Activity,
  Layers,
  Wrench,
  Calendar,
  AlertTriangle,
  Zap,
  TrendingUp,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Radio,
  Clock,
  ExternalLink
} from 'lucide-react';
import { MetricCard } from '../components/common/MetricCard';
import { CorridorTimeline } from '../components/dashboard/CorridorTimeline';
import { ConflictAlerts } from '../components/dashboard/ConflictAlerts';
import { WorkloadDistribution } from '../components/dashboard/WorkloadDistribution';

export const DashboardPage = ({ onNavigate }) => {
  const { selectedCorridor, tasks, blockPlans, recommendations, istTimeStr } = useRailway();

  const criticalTasksCount = tasks.filter(t => t.priority === 'CRITICAL' || t.priority === 'EMERGENCY').length;
  const pendingTasksCount = tasks.filter(t => t.status === 'PENDING_BLOCK').length;
  const approvedBlocksCount = blockPlans.filter(p => p.status === 'APPROVED_BY_CONTROLLER').length;

  return (
    <div className="space-y-6">
      {/* Corridor Operations Status Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-900 via-railway-navy to-slate-900 text-white p-5 sm:p-6 shadow-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                ACTIVE SECTION CONTROLLER DESK
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-mono">
                {selectedCorridor.division}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              {selectedCorridor.name}
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-red-950/80 border border-red-800 text-red-300">
                {selectedCorridor.code}
              </span>
            </h2>

            <p className="text-xs text-slate-300 font-mono max-w-2xl">
              Track Length: {selectedCorridor.lengthKm} Tkm • Capacity Utilization: {selectedCorridor.capacityUtilization}% • Signaling: {selectedCorridor.signaling}
            </p>
          </div>

          {/* Quick CTA to AI Planning */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('ai-planning')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-railway-maroon hover:from-red-500 hover:to-red-600 text-white text-xs font-bold shadow-lg shadow-red-950/40 flex items-center gap-2 transition-all group"
            >
              <Cpu className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span>Generate AI Block Plan</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* 5 Core Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Asset Availability"
          value="96.4"
          unit="%"
          change="+1.2%"
          changeType="positive"
          subtitle="over target (95%)"
          icon={Activity}
          accentColor="green"
          footer="840 Track Km Monitored"
        />

        <MetricCard
          title="Critical Tasks"
          value={criticalTasksCount}
          unit={`/ ${tasks.length}`}
          change="3 Urgent"
          changeType="negative"
          subtitle="immediate action"
          icon={AlertTriangle}
          accentColor="red"
          footer={`${pendingTasksCount} Requisitions Pending`}
        />

        <MetricCard
          title="Planned Blocks"
          value={blockPlans.length}
          unit="Active"
          change={`${approvedBlocksCount} Approved`}
          changeType="positive"
          subtitle="for current week"
          icon={Calendar}
          accentColor="blue"
          footer="100% Shadow Bundling Enabled"
        />

        <MetricCard
          title="Train Conflicts"
          value="0"
          unit="Unresolved"
          change="2 Auto-Resolved"
          changeType="positive"
          subtitle="by RailOpt MILP"
          icon={ShieldCheck}
          accentColor="amber"
          footer="Zero Unplanned Detentions"
        />

        <MetricCard
          title="Maintenance Workload"
          value="78.2"
          unit="Hrs/Wk"
          change="Optimal"
          changeType="neutral"
          subtitle="P-Way 46% • TRD 28%"
          icon={Wrench}
          accentColor="purple"
          footer="Machine Utilization: 93.8%"
        />
      </div>

      {/* Core Signature Feature: Interactive Corridor Timeline */}
      <CorridorTimeline />

      {/* Secondary Telemetry: Conflicts & Department Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConflictAlerts />
        <WorkloadDistribution />
      </div>
    </div>
  );
};
