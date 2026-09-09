import React, { useState } from 'react';
import { useRailway } from '../context/RailwayContext';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  Zap,
  Activity,
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';

export const MaintenanceTasksPage = ({ onNavigateToPlanning }) => {
  const { tasks, addTask, selectedCorridor } = useRailway();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('TABLE'); // 'TABLE' or 'KANBAN'

  // New Requisition Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDepartment, setNewDepartment] = useState('P_WAY');
  const [newSection, setNewSection] = useState('ALJN - TDL (Km 165/10)');
  const [newTrack, setNewTrack] = useState('UP_MAIN');
  const [newPriority, setNewPriority] = useState('HIGH');
  const [newWindowHours, setNewWindowHours] = useState(3.0);
  const [newMachine, setNewMachine] = useState('CSM (09-32 Tamping Machine)');
  const [newReason, setNewReason] = useState('');
  const [newPowerBlock, setNewPowerBlock] = useState(false);

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.section.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = departmentFilter === 'ALL' || t.department === departmentFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;

    return matchesSearch && matchesDept && matchesPriority;
  });

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTask({
      title: newTitle,
      corridorId: selectedCorridor.id,
      corridorName: selectedCorridor.name,
      department: newDepartment,
      departmentName:
        newDepartment === 'P_WAY'
          ? 'Engineering (P-Way)'
          : newDepartment === 'TRD_OHE'
          ? 'Electrical (TRD / OHE)'
          : 'Signalling & Telecom (S&T)',
      section: newSection,
      stationFrom: 'ALJN',
      stationTo: 'TDL',
      track: newTrack,
      priority: newPriority,
      requiredWindowHours: parseFloat(newWindowHours),
      machineRequired: newMachine,
      secondaryMachine: 'None',
      crewSize: 10,
      disconnectionNoticeRequired: true,
      powerBlockRequired: newPowerBlock,
      trafficBlockRequired: true,
      speedRestrictionImposed: '45 km/h caution order for 48h post work',
      scheduledDate: '2026-09-12',
      reason: newReason || 'Routine track geometry maintenance and ultrasonic inspection.'
    });

    setIsModalOpen(false);
    setNewTitle('');
    setNewReason('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1626] p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-red-600 dark:text-red-400" />
              Railway Maintenance Requisitions
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {tasks.length} Requisitions
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Permanent Way (Track), Overhead Equipment (OHE), and S&T block requests awaiting traffic possession
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode(viewMode === 'TABLE' ? 'KANBAN' : 'TABLE')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 text-xs font-semibold transition-colors"
          >
            {viewMode === 'TABLE' ? 'Kanban View' : 'Table View'}
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-700 to-railway-maroon hover:from-red-600 hover:to-red-700 text-white text-xs font-bold shadow-md shadow-red-950/30 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Requisition</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1626] shadow-sm">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by task ID, title, or section..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111A2E] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Department Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111A2E] text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Departments</option>
              <option value="P_WAY">Engineering (P-Way)</option>
              <option value="TRD_OHE">Electrical (TRD / OHE)</option>
              <option value="S_AND_T">Signalling & Telecom</option>
            </select>
          </div>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111A2E] text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="EMERGENCY">Emergency</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
          </select>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'TABLE' ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1626] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[720px]">
              <thead className="bg-slate-100 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 font-mono uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Task ID & Department</th>
                  <th className="px-4 py-3">Maintenance Description</th>
                  <th className="px-3 py-3">Section & Track</th>
                  <th className="px-3 py-3">Window Needed</th>
                  <th className="px-3 py-3">Track Machine</th>
                  <th className="px-3 py-3">Priority</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {filteredTasks.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {t.id}
                      </div>
                      <div className="text-[10px] text-slate-400 font-sans">
                        {t.departmentName}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-sans">
                      <div className="font-bold text-slate-800 dark:text-slate-200 max-w-xs">
                        {t.title}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-xs mt-0.5">
                        {t.reason}
                      </div>
                    </td>

                    <td className="px-3 py-3.5">
                      <div className="font-bold text-slate-700 dark:text-slate-300">
                        {t.section}
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {t.track}
                      </span>
                    </td>

                    <td className="px-3 py-3.5">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {t.requiredWindowHours} hrs
                      </span>
                      {t.powerBlockRequired && (
                        <span className="block text-[9px] text-amber-500 font-bold">
                          ⚡ 25kV OHE Cut
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-3.5 font-sans text-slate-600 dark:text-slate-300">
                      {t.machineRequired}
                    </td>

                    <td className="px-3 py-3.5">
                      <StatusBadge status={t.priority} size="xs" />
                    </td>

                    <td className="px-3 py-3.5">
                      <StatusBadge status={t.status} size="xs" />
                    </td>

                    <td className="px-4 py-3.5 text-right font-sans">
                      <button
                        onClick={() => onNavigateToPlanning && onNavigateToPlanning(t)}
                        className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 text-[11px] font-bold transition-colors inline-flex items-center gap-1"
                      >
                        <span>Plan Block</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Kanban View */
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { id: 'PENDING_BLOCK', label: 'Pending Block Window', color: 'amber' },
            { id: 'SHADOW_ELIGIBLE', label: 'Shadow Bundled / Ready', color: 'sky' },
            { id: 'APPROVED', label: 'Approved by Controller', color: 'emerald' }
          ].map((column) => {
            const columnTasks = filteredTasks.filter((t) =>
              column.id === 'PENDING_BLOCK'
                ? t.status === 'PENDING_BLOCK'
                : column.id === 'SHADOW_ELIGIBLE'
                ? t.status === 'SHADOW_ELIGIBLE'
                : t.status === 'APPROVED' || t.status === 'SCHEDULED'
            );

            return (
              <div
                key={column.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B1220] p-4 flex flex-col"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                    {column.label}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="mt-3 space-y-3 flex-1">
                  {columnTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1626] shadow-sm hover:border-slate-300 transition-all space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-slate-900 dark:text-white text-[11px]">
                          {t.id}
                        </span>
                        <StatusBadge status={t.priority} size="xs" />
                      </div>

                      <div className="font-bold text-slate-800 dark:text-slate-100">
                        {t.title}
                      </div>

                      <div className="text-[11px] text-slate-500 font-mono">
                        {t.section} • {t.track}
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400">
                          {t.requiredWindowHours}h window
                        </span>
                        <button
                          onClick={() => onNavigateToPlanning && onNavigateToPlanning(t)}
                          className="text-red-600 dark:text-red-400 font-bold hover:underline flex items-center gap-1"
                        >
                          Plan Block <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Requisition Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit Maintenance Block Requisition"
        subtitle="Formal request to Section Controller for line possession and traction power cutoff"
        footer={
          <>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateTask}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-700 to-railway-maroon text-white text-xs font-bold hover:from-red-600"
            >
              Submit Requisition
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
          <div>
            <label className="font-mono font-bold uppercase text-[11px] text-slate-500 block mb-1">
              Maintenance Work Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Continuous Track Tamping or OHE Dropper Replacement"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111A2E] text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-mono font-bold uppercase text-[11px] text-slate-500 block mb-1">
                Department
              </label>
              <select
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111A2E] text-slate-900 dark:text-white"
              >
                <option value="P_WAY">Engineering (P-Way Track)</option>
                <option value="TRD_OHE">Electrical (TRD / OHE)</option>
                <option value="S_AND_T">Signalling & Telecom (S&T)</option>
              </select>
            </div>

            <div>
              <label className="font-mono font-bold uppercase text-[11px] text-slate-500 block mb-1">
                Priority
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111A2E] text-slate-900 dark:text-white"
              >
                <option value="EMERGENCY">Emergency (USFD / Rail Fracture)</option>
                <option value="CRITICAL">Critical (TGI Degradation)</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Routine Maintenance</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-mono font-bold uppercase text-[11px] text-slate-500 block mb-1">
                Corridor Section & Km
              </label>
              <input
                type="text"
                value={newSection}
                onChange={(e) => setNewSection(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111A2E] text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-mono font-bold uppercase text-[11px] text-slate-500 block mb-1">
                Track Line
              </label>
              <select
                value={newTrack}
                onChange={(e) => setNewTrack(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111A2E] text-slate-900 dark:text-white"
              >
                <option value="UP_MAIN">UP Main Line</option>
                <option value="DN_MAIN">DOWN Main Line</option>
                <option value="3RD_LINE">3rd Line / Freight Loop</option>
                <option value="BOTH">Both Lines (Full Isolation)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-mono font-bold uppercase text-[11px] text-slate-500 block mb-1">
                Required Window (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="1.0"
                max="8.0"
                value={newWindowHours}
                onChange={(e) => setNewWindowHours(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111A2E] text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-mono font-bold uppercase text-[11px] text-slate-500 block mb-1">
                Track Machine Deployment
              </label>
              <select
                value={newMachine}
                onChange={(e) => setNewMachine(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111A2E] text-slate-900 dark:text-white"
              >
                <option value="CSM (09-32 Tamping Machine)">CSM Tamping Machine</option>
                <option value="BCM (Ballast Cleaning Machine)">BCM Ballast Cleaner</option>
                <option value="UNIMAT 08-4S (Point Tamping)">UNIMAT Point Tamping</option>
                <option value="4-Wheeler OHE Tower Wagon">OHE Tower Wagon</option>
                <option value="None / Manual Hand Work">Manual Hand Tools Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-mono font-bold uppercase text-[11px] text-slate-500 block mb-1">
              Engineering Justification / Defect Details
            </label>
            <textarea
              rows="3"
              placeholder="Describe track geometry defects, ultrasonic findings, or contact wire wear..."
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111A2E] text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="powerBlockCheck"
              checked={newPowerBlock}
              onChange={(e) => setNewPowerBlock(e.target.checked)}
              className="rounded border-slate-300 text-red-600 focus:ring-red-500"
            />
            <label htmlFor="powerBlockCheck" className="text-slate-700 dark:text-slate-300 text-xs">
              Requires 25 kV AC Traction Power Block (OHE De-energization)
            </label>
          </div>
        </form>
      </Modal>
    </div>
  );
};
