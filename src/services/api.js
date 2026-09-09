/**
 * RailOpt AI - Backend API Integration Layer
 * 
 * Supports both Mock Local State and seamless connection to:
 * 1. Spring Boot REST API (default: http://localhost:8080/api)
 * 2. Python AI / Optimization Service (default: http://localhost:8000/api)
 */

import { corridors } from '../data/corridorsData';
import { trains } from '../data/trainsData';
import { maintenanceTasks } from '../data/maintenanceTasksData';
import { railwayAssets } from '../data/assetsData';
import { mockGeneratedBlockPlans } from '../data/blockPlansData';
import { runAiBlockOptimization } from './blockOptimizer';

// Configuration
export const API_CONFIG = {
  USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API !== 'false', // Default true
  SPRING_BOOT_BASE_URL: import.meta.env.VITE_SPRING_BOOT_URL || 'http://localhost:8080/api',
  PYTHON_AI_BASE_URL: import.meta.env.VITE_PYTHON_AI_URL || 'http://localhost:8000/api',
  SIMULATED_NETWORK_LATENCY_MS: 300
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const RailwayApiService = {
  // Corridors
  async getCorridors() {
    if (API_CONFIG.USE_MOCK_API) {
      await delay(API_CONFIG.SIMULATED_NETWORK_LATENCY_MS);
      return corridors;
    }
    const res = await fetch(`${API_CONFIG.SPRING_BOOT_BASE_URL}/corridors`);
    return res.json();
  },

  // Trains
  async getTrainsByCorridor(corridorId) {
    if (API_CONFIG.USE_MOCK_API) {
      await delay(API_CONFIG.SIMULATED_NETWORK_LATENCY_MS);
      return trains.filter(t => !corridorId || t.corridorId === corridorId);
    }
    const res = await fetch(`${API_CONFIG.SPRING_BOOT_BASE_URL}/trains?corridorId=${corridorId}`);
    return res.json();
  },

  // Maintenance Tasks
  async getMaintenanceTasks(filters = {}) {
    if (API_CONFIG.USE_MOCK_API) {
      await delay(API_CONFIG.SIMULATED_NETWORK_LATENCY_MS);
      let results = [...maintenanceTasks];
      if (filters.corridorId) results = results.filter(t => t.corridorId === filters.corridorId);
      if (filters.department) results = results.filter(t => t.department === filters.department);
      if (filters.priority) results = results.filter(t => t.priority === filters.priority);
      return results;
    }
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_CONFIG.SPRING_BOOT_BASE_URL}/maintenance-tasks?${params}`);
    return res.json();
  },

  // Railway Assets
  async getRailwayAssets(filters = {}) {
    if (API_CONFIG.USE_MOCK_API) {
      await delay(API_CONFIG.SIMULATED_NETWORK_LATENCY_MS);
      let results = [...railwayAssets];
      if (filters.corridorId) results = results.filter(a => a.corridorId === filters.corridorId);
      if (filters.category) results = results.filter(a => a.category === filters.category);
      if (filters.status) results = results.filter(a => a.status === filters.status);
      return results;
    }
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_CONFIG.SPRING_BOOT_BASE_URL}/assets?${params}`);
    return res.json();
  },

  // Block Plans
  async getBlockPlans() {
    if (API_CONFIG.USE_MOCK_API) {
      await delay(API_CONFIG.SIMULATED_NETWORK_LATENCY_MS);
      return mockGeneratedBlockPlans;
    }
    const res = await fetch(`${API_CONFIG.SPRING_BOOT_BASE_URL}/block-plans`);
    return res.json();
  },

  // Generate AI Block Plan (Calls Python AI Optimizer or realistic simulation)
  async generateAiBlockPlan(params) {
    if (API_CONFIG.USE_MOCK_API) {
      // Simulate Python solver computation time (1.2 seconds)
      await delay(1200);
      return runAiBlockOptimization(params);
    }
    const res = await fetch(`${API_CONFIG.PYTHON_AI_BASE_URL}/optimize-block`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return res.json();
  },

  // Approve & Push to COIS/FOIS
  async approveAndDispatchPlan(planId, officerDetails) {
    if (API_CONFIG.USE_MOCK_API) {
      await delay(600);
      return {
        success: true,
        planId,
        coisDispatchId: `COIS-NCR-BLK-${Math.floor(10000 + Math.random() * 90000)}`,
        foisClearanceId: `FOIS-REF-${Math.floor(100000 + Math.random() * 900000)}`,
        status: "APPROVED_AND_TRANSMITTED",
        timestamp: new Date().toISOString()
      };
    }
    const res = await fetch(`${API_CONFIG.SPRING_BOOT_BASE_URL}/block-plans/${planId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(officerDetails)
    });
    return res.json();
  }
};
