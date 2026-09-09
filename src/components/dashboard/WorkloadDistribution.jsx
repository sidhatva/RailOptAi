import React from 'react';
import { departmentWorkload } from '../../data/analyticsData';
import { Wrench, Zap, Activity, CheckCircle2, TrendingUp } from 'lucide-react';

export const WorkloadDistribution = () => {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1626] p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
            Departmental Maintenance Workload
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Requisitions backlog & target block windows across departments
          </p>
        </div>
        <span className="text-xs font-mono text-slate-500">127 Tasks Active</span>
      </div>

      {/* Progress Bars by Department */}
      <div className="mt-4 space-y-3.5">
        {departmentWorkload.map((dept) => (
          <div key={dept.name} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: dept.color }}
                />
                {dept.name}
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {dept.value}% ({dept.tasksCount} tasks)
              </span>
            </div>
            {/* Bar */}
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${dept.value}%`,
                  backgroundColor: dept.color
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="mt-5 p-3 rounded-lg bg-slate-50 dark:bg-[#111A2E] border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span className="text-slate-600 dark:text-slate-300">
            Shadow Bundling Efficiency: <strong className="text-emerald-500">+38% higher</strong>
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">COIS Synchronized</span>
      </div>
    </div>
  );
};
