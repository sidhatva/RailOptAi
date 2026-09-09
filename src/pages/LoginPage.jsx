import React, { useState } from 'react';
import { useRailway, USER_ROLES } from '../context/RailwayContext';
import { Train, ShieldCheck, Lock, ArrowRight, UserCheck, CheckCircle2, Shield, KeyRound } from 'lucide-react';

export const LoginPage = ({ onLoginSuccess }) => {
  const { currentUser, switchRole, setCurrentUser, addToast, corridors } = useRailway();
  const [selectedRole, setSelectedRole] = useState(currentUser.role);
  const [selectedDivision, setSelectedDivision] = useState(currentUser.division);
  const [username, setUsername] = useState('r.sharma.irts');
  const [password, setPassword] = useState('••••••••••••');

  const divisions = [
    'NCR - Prayagraj Division',
    'NR - Delhi Division',
    'WR - Mumbai Division',
    'ECR - Danapur Division',
    'ER - Howrah Division'
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    switchRole(selectedRole);
    setCurrentUser(prev => ({
      ...prev,
      division: selectedDivision
    }));
    addToast(`Authenticated as ${selectedRole} - ${selectedDivision}`, 'success');
    if (onLoginSuccess) onLoginSuccess();
  };

  const handleQuickRole = (roleId) => {
    setSelectedRole(roleId);
    switchRole(roleId);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1525] shadow-2xl overflow-hidden">
        {/* Left: Indian Railways Control Room Branding */}
        <div className="p-8 bg-gradient-to-br from-railway-navy via-slate-900 to-[#080C14] text-white flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-slate-800">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-railway-maroon flex items-center justify-center shadow-lg shadow-red-950/50 border border-red-500/30">
                <Train className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight flex items-center gap-1.5">
                  RailOpt <span className="text-red-500">AI</span>
                </h1>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                  CRIS • Indian Railways Control System
                </span>
              </div>
            </div>

            <h2 className="text-lg font-bold text-slate-100 mb-2">
              Automatic Block Planning System
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-driven optimization of traffic and power maintenance windows across High Density Networks (HDN). Minimizing passenger delays while maximizing track machine productivity.
            </p>

            {/* Feature bullets */}
            <div className="mt-6 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Pareto-Optimal Traffic & Power Window Allocation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Multi-Departmental Shadow Block Bundling</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Automated COIS / FOIS Conflict Clearance</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>SECURE GATEWAY: TLS 1.3</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              G&SR Verified
            </span>
          </div>
        </div>

        {/* Right: Login & Quick Role Switcher */}
        <div className="p-8 flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Officer Authentication
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select your designated role to enter the control room console
              </p>
            </div>

            {/* Quick 1-Click Role Selection */}
            <div className="mb-5">
              <label className="text-[11px] font-mono uppercase font-bold text-slate-500 dark:text-slate-400 block mb-2">
                Quick Role Preset
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {USER_ROLES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleQuickRole(r.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                      selectedRole === r.id
                        ? 'border-red-600 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="truncate text-[11px]">{r.title}</div>
                      <div className="text-[9px] text-slate-400 font-mono">{r.dept}</div>
                    </div>
                    {selectedRole === r.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 block mb-1">
                  Railway Division
                </label>
                <select
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {divisions.map((div) => (
                    <option key={div} value={div}>
                      {div}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 block mb-1">
                  CRIS Officer ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 pl-9 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter Railway ID"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 block mb-1">
                  Security Token / Passkey
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 pl-9 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-700 to-railway-maroon hover:from-red-600 hover:to-red-700 text-white font-bold text-xs shadow-lg shadow-red-950/30 flex items-center justify-center gap-2 transition-all"
              >
                <span>Authorize & Open Control Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="mt-6 text-center text-[10px] text-slate-400 font-mono">
            Indian Railways Information System • All Operations Audited
          </div>
        </div>
      </div>
    </div>
  );
};
