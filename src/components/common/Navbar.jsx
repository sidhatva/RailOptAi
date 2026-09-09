import React, { useState } from 'react';
import { useRailway, USER_ROLES } from '../../context/RailwayContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Train,
  Clock,
  Sun,
  Moon,
  ShieldCheck,
  ChevronDown,
  Bell,
  Menu,
  Zap,
  Activity,
  AlertTriangle,
  Radio,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

import { IstClock } from './IstClock';

export const Navbar = ({ onToggleSidebar }) => {
  const {
    currentUser,
    switchRole,
    selectedCorridor,
    selectedCorridorId,
    setSelectedCorridorId,
    corridors,
    toasts
  } = useRailway();

  const { isDark, toggleTheme } = useTheme();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [corridorDropdownOpen, setCorridorDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#090E1A]/95 backdrop-blur-md">
      {/* Upper Technical Ticker Bar */}
      <div className="hidden lg:flex items-center justify-between px-6 py-1 text-[11px] bg-slate-900 text-slate-300 dark:bg-black/60 dark:text-slate-400 border-b border-slate-800 font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            MINISTRY OF RAILWAYS (INDIAN RAILWAYS) • CRIS / COIS FEED CONNECTED
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">
            SYSTEM ENGINE: <strong className="text-white">RailOpt MILP-v4.2</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-400 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            2 ACTIVE CAUTION ORDERS (TSR) IN NCR DIVISION
          </span>
        </div>

        <IstClock />
      </div>

      {/* Main Navbar */}
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left: Mobile Toggle & Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-railway-maroon to-red-800 flex items-center justify-center shadow-md shadow-red-950/30 text-white font-black text-lg tracking-tighter border border-red-500/40">
              <Train className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                  RailOpt <span className="text-railway-maroonBright dark:text-red-500">AI</span>
                </span>
                <span className="text-[10px] uppercase font-bold font-mono px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-900">
                  IR-CTRL
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Automatic Block Planning & Optimization System
              </p>
            </div>
          </div>
        </div>

        {/* Center: Active Corridor Selector */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setCorridorDropdownOpen(!corridorDropdownOpen)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111A2E] hover:border-slate-300 dark:hover:border-slate-700 transition-all text-xs text-left"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">Active Corridor</div>
              <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                {selectedCorridor.name}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          </button>

          {corridorDropdownOpen && (
            <div
              className="absolute left-0 mt-2 w-80 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-xl z-50 p-2 text-xs"
              onClick={() => setCorridorDropdownOpen(false)}
            >
              <div className="px-3 py-1.5 font-bold text-slate-400 text-[10px] uppercase font-mono">
                Select Railway Corridor
              </div>
              {corridors.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCorridorId(c.id)}
                  className={`w-full text-left p-2.5 rounded-lg transition-colors flex items-center justify-between ${
                    c.id === selectedCorridorId
                      ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-semibold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {c.zone} • {c.lengthKm} km • {c.capacityUtilization}% Capacity
                    </div>
                  </div>
                  {c.id === selectedCorridorId && (
                    <CheckCircle2 className="w-4 h-4 text-red-500" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Controls: Role, Clock, Theme, Notifications */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Clock */}
          <IstClock variant="mobile" className="lg:hidden" />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? "Switch to High-Contrast Light Sheet" : "Switch to Control Room Dark Mode"}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* User Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111A2E] hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-red-800/20 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs">
                {currentUser.role === 'CHIEF_CONTROLLER' ? 'CC' : currentUser.role.slice(0, 3)}
              </div>
              <div className="hidden xl:block">
                <div className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                  <span>{currentUser.division}</span>
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                  {currentUser.title}
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
              </div>
            </button>

            {roleDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-xl z-50 p-2 text-xs"
                onClick={() => setRoleDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-400 uppercase font-mono">
                    Officer In Charge
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Badge: {currentUser.badgeId} • {currentUser.division}
                  </div>
                </div>

                <div className="p-1">
                  <div className="px-2 py-1.5 text-[10px] font-mono uppercase text-slate-400">
                    Switch Control Role
                  </div>
                  {USER_ROLES.map(r => (
                    <button
                      key={r.id}
                      onClick={() => switchRole(r.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                        currentUser.role === r.id
                          ? 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 font-semibold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div>
                        <div>{r.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{r.dept} Dept</div>
                      </div>
                      {currentUser.role === r.id && (
                        <CheckCircle2 className="w-4 h-4 text-red-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Toasts */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-xl p-3.5 shadow-xl border text-xs font-medium flex items-center gap-2.5 transition-all animate-bounce-short ${
              t.type === 'success'
                ? 'bg-emerald-900/90 text-emerald-100 border-emerald-500/40 backdrop-blur'
                : t.type === 'error'
                ? 'bg-red-900/90 text-red-100 border-red-500/40 backdrop-blur'
                : 'bg-slate-900/90 text-slate-100 border-slate-700 backdrop-blur'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="flex-1">{t.message}</span>
          </div>
        ))}
      </div>
    </header>
  );
};
