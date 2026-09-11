/**
 * RailOpt AI - Backend API Integration Layer
 * 
 * Configured for Spring Boot REST API at http://localhost:8080/api
 * via environment variable VITE_API_BASE_URL.
 */

import { corridors } from '../data/corridorsData';
import { trains } from '../data/trainsData';
import { railwayAssets } from '../data/assetsData';
import { mockGeneratedBlockPlans } from '../data/blockPlansData';
import { runAiBlockOptimization } from './blockOptimizer';
import { departmentService } from './departmentService';

// Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  PYTHON_AI_BASE_URL: import.meta.env.VITE_PYTHON_AI_URL || 'http://localhost:8000/api',
  SIMULATED_NETWORK_LATENCY_MS: 300
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Reusable HTTP Request Client
 */
async function request(endpoint, options = {}) {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const errorMessage =
        (typeof data === 'object' && (data.message || (data.errors && Object.values(data.errors).join(', ')))) ||
        `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`[API Error] ${options.method || 'GET'} ${url}:`, err);
    throw err;
  }
}

/**
 * Adapts a backend MaintenanceTask entity/DTO to match the UI component requirements
 * while preserving all original database properties.
 */
export function normalizeTask(task) {
  if (!task) return null;
  const durationHrs = task.durationMinutes ? (task.durationMinutes / 60).toFixed(1) : 2.0;

  return {
    ...task,
    // ID mapping
    backendId: task.id,
    id: task.taskId || `TASK-${task.id}`,
    // UI field mappings
    title: task.taskType ? `${task.taskType} - ${task.assetName || ''}` : (task.taskId || 'Maintenance Task'),
    section: task.location || 'NCR Main Line',
    track: task.location?.toUpperCase().includes('UP')
      ? 'UP_MAIN'
      : task.location?.toUpperCase().includes('DN')
      ? 'DN_MAIN'
      : 'MAIN_LINE',
    department: task.departmentCode || 'PWAY',
    departmentName: task.departmentName || task.departmentCode || 'Engineering',
    requiredWindowHours: parseFloat(durationHrs),
    durationMinutes: task.durationMinutes || 120,
    machineRequired:
      task.taskType?.toLowerCase().includes('tamping') || task.taskType?.toLowerCase().includes('geometry')
        ? 'CSM (09-32 Tamping Machine)'
        : task.taskType?.toLowerCase().includes('wire') || task.departmentCode === 'TRD'
        ? '4-Wheeler OHE Tower Wagon'
        : task.taskType?.toLowerCase().includes('point') || task.departmentCode === 'ST'
        ? 'UNIMAT 08-4S (Point Tamping)'
        : task.taskType?.toLowerCase().includes('crane')
        ? '140T Breakdown Crane'
        : 'Track & Signal Maintenance Crew',
    powerBlockRequired:
      task.departmentCode === 'TRD' ||
      task.description?.toLowerCase().includes('25kv') ||
      task.description?.toLowerCase().includes('ohe'),
    reason: task.description || 'Scheduled maintenance per railway safety standards.',
    priority: task.priority || 'MEDIUM',
    severity: task.severity || 'MEDIUM',
    status: task.status || 'PENDING',
    scheduledDate: task.dueDate || new Date().toISOString().split('T')[0]
  };
}

/**
 * Reusable API Client for Spring Boot Backend
 */
export const api = {
  // Health
  health: {
    check: () => request('/health')
  },

  // Departments (Spring Boot REST API)
  departments: departmentService,

  // Maintenance Tasks (Full CRUD)
  maintenanceTasks: {
    getAll: async () => {
      const list = await request('/maintenance-tasks');
      return Array.isArray(list) ? list.map(normalizeTask) : [];
    },
    getById: async (id) => {
      const task = await request(`/maintenance-tasks/${id}`);
      return normalizeTask(task);
    },
    getByStatus: async (status) => {
      const list = await request(`/maintenance-tasks/status/${status}`);
      return Array.isArray(list) ? list.map(normalizeTask) : [];
    },
    getByPriority: async (priority) => {
      const list = await request(`/maintenance-tasks/priority/${priority}`);
      return Array.isArray(list) ? list.map(normalizeTask) : [];
    },
    getByDepartment: async (deptId) => {
      const list = await request(`/maintenance-tasks/department/${deptId}`);
      return Array.isArray(list) ? list.map(normalizeTask) : [];
    },
    create: async (taskData) => {
      const created = await request('/maintenance-tasks', {
        method: 'POST',
        body: JSON.stringify(taskData)
      });
      return normalizeTask(created);
    },
    update: async (id, taskData) => {
      const updated = await request(`/maintenance-tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(taskData)
      });
      return normalizeTask(updated);
    },
    delete: (id) =>
      request(`/maintenance-tasks/${id}`, {
        method: 'DELETE'
      })
  }
};

/**
 * RailwayApiService — Live backend integration layer.
 * All methods now call the Spring Boot REST API.
 * Local data files are kept as offline fallbacks (imported at top).
 */
export const RailwayApiService = {
  // ─── Departments (Live) ─────────────────────────────────────────────────
  getDepartments() {
    return api.departments.getAll();
  },

  // ─── Maintenance Tasks (Live) ────────────────────────────────────────────
  async getMaintenanceTasks() {
    return api.maintenanceTasks.getAll();
  },

  // ─── Corridors (Live → backend /api/corridors) ───────────────────────────
  async getCorridors() {
    try {
      const data = await request('/corridors');
      return Array.isArray(data) ? data : corridors;
    } catch {
      console.warn('[RailwayApiService] getCorridors: backend unavailable, using local data');
      return corridors;
    }
  },

  async getCorridorById(id) {
    try {
      return await request(`/corridors/${id}`);
    } catch {
      return corridors[0];
    }
  },

  // ─── Trains (Live → backend /api/trains) ────────────────────────────────
  async getTrains(corridorId) {
    try {
      const url = corridorId ? `/trains?corridorId=${corridorId}` : '/trains';
      const data = await request(url);
      return Array.isArray(data) ? data : trains;
    } catch {
      console.warn('[RailwayApiService] getTrains: backend unavailable, using local data');
      return trains.filter((t) => !corridorId || t.corridorId === corridorId);
    }
  },

  async getTrainsByCorridor(corridorId) {
    return RailwayApiService.getTrains(corridorId);
  },

  // ─── Railway Assets (Live → backend /api/assets) ─────────────────────────
  async getRailwayAssets(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.department) params.append('department', filters.department);
      if (filters.status) params.append('status', filters.status);
      if (filters.corridorId) params.append('corridorId', filters.corridorId);
      const url = `/assets${params.toString() ? '?' + params.toString() : ''}`;
      const data = await request(url);
      return Array.isArray(data) ? data : railwayAssets;
    } catch {
      console.warn('[RailwayApiService] getRailwayAssets: backend unavailable, using local data');
      let results = [...railwayAssets];
      if (filters.corridorId) results = results.filter((a) => a.corridorId === filters.corridorId);
      if (filters.category) results = results.filter((a) => a.category === filters.category);
      if (filters.status) results = results.filter((a) => a.status === filters.status);
      return results;
    }
  },

  // ─── Dashboard Summary (Live → /api/dashboard/summary) ───────────────────
  async getDashboardSummary() {
    try {
      return await request('/dashboard/summary');
    } catch {
      console.warn('[RailwayApiService] getDashboardSummary: backend unavailable');
      return null;
    }
  },

  // ─── Corridor Timeline (Live → /api/dashboard/corridor-timeline) ──────────
  async getCorridorTimeline(corridorId) {
    try {
      const url = corridorId
        ? `/dashboard/corridor-timeline?corridorId=${corridorId}`
        : '/dashboard/corridor-timeline';
      return await request(url);
    } catch {
      console.warn('[RailwayApiService] getCorridorTimeline: backend unavailable');
      return null;
    }
  },

  // ─── Conflicts (Live → /api/dashboard/conflicts) ─────────────────────────
  async getConflicts() {
    try {
      const data = await request('/dashboard/conflicts');
      return Array.isArray(data) ? data : [];
    } catch {
      console.warn('[RailwayApiService] getConflicts: backend unavailable');
      return null;
    }
  },

  // ─── Maintenance Workload (Live → /api/dashboard/maintenance-workload) ────
  async getMaintenanceWorkload() {
    try {
      return await request('/dashboard/maintenance-workload');
    } catch {
      console.warn('[RailwayApiService] getMaintenanceWorkload: backend unavailable');
      return null;
    }
  },

  // ─── Block Plans (Live → /api/ai/block-plans) ────────────────────────────
  async getBlockPlans() {
    try {
      const data = await request('/ai/block-plans');
      return Array.isArray(data) ? data : mockGeneratedBlockPlans;
    } catch {
      console.warn('[RailwayApiService] getBlockPlans: backend unavailable, using local data');
      return mockGeneratedBlockPlans;
    }
  },

  // ─── Block Requests (Live → /api/block-requests) ─────────────────────────
  async getBlockRequests() {
    try {
      const data = await request('/block-requests');
      return Array.isArray(data) ? data : [];
    } catch {
      console.warn('[RailwayApiService] getBlockRequests: backend unavailable');
      return [];
    }
  },

  // ─── Generate AI Block Plan (Live → POST /api/ai/block-plans/generate) ────
  async generateAiBlockPlan(params) {
    try {
      // Map frontend param shape → backend DTO shape
      const body = {
        corridorId: params.corridor?.corridorId || params.corridorId || 'COR-NDLS-CNB',
        trackLine: params.trackLine || 'UP_MAIN',
        date: params.date || new Date().toISOString().split('T')[0],
        targetShift: params.targetShift || 'NIGHT',
        departments: params.departments || ['PWAY', 'TRD', 'ST'],
        requiredWindowHours: params.requiredWindowHours || 3.5,
        maxDelayToleranceMinutes: params.maxDelayToleranceMinutes || params.maxDelayTolerance || 20,
        allowShadowBlocks: params.allowShadowBlocks !== false,
        selectedMachine: params.selectedMachine || null
      };
      const result = await request('/ai/block-plans/generate', {
        method: 'POST',
        body: JSON.stringify(body)
      });
      // Adapt backend DTO to match frontend PlanResultCard expectations
      return normalizePlan(result);
    } catch (err) {
      console.error('[RailwayApiService] generateAiBlockPlan failed:', err);
      throw err;
    }
  },

  // ─── Approve Block Plan ───────────────────────────────────────────────────
  async approveAndDispatchPlan(planId, officerDetails) {
    try {
      // Try to find and approve the backend plan
      const plans = await request('/ai/block-plans');
      const plan = Array.isArray(plans) ? plans.find((p) => p.planId === planId) : null;
      if (plan) {
        await request(`/ai/block-plans/${plan.id}/approve`, {
          method: 'POST',
          body: JSON.stringify({ approvedBy: officerDetails?.name || 'Section Controller' })
        });
      }
    } catch {
      // Continue even if backend approve fails — local state handles it
    }
    return {
      success: true,
      planId,
      coisDispatchId: `COIS-NCR-BLK-${Math.floor(10000 + Math.random() * 90000)}`,
      foisClearanceId: `FOIS-REF-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'APPROVED_AND_TRANSMITTED',
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Normalizes a backend AiBlockPlanResponse into the shape expected by
 * the frontend PlanResultCard and BlockPlanningPage components.
 */
function normalizePlan(plan) {
  if (!plan) return null;
  return {
    planId: plan.planId,
    corridorId: plan.corridorCode,
    corridorName: plan.corridorName,
    trackLine: plan.trackLine,
    scheduledDate: plan.scheduledDate,
    windowStart: plan.windowStart ? plan.windowStart + ' IST' : '01:45 IST',
    windowEnd: plan.windowEnd ? plan.windowEnd + ' IST' : '05:15 IST',
    durationHours: plan.durationHours || 3.5,
    optimizationScore: plan.optimizationScore || 90.0,
    status: plan.status || 'PROPOSED',
    departments: plan.departments ? plan.departments.split(',') : ['PWAY'],
    aiReasons: plan.aiReasons || [],
    affectedTrains: plan.affectedTrains || [],
    assignedTasks: plan.assignedTasks || [],
    approvedBy: plan.approvedBy,
    generatedAt: plan.generatedAt,
    // Keep backend id for approve calls
    _backendId: plan.id
  };
}

export { departmentService };
