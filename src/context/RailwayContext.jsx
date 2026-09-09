import React, { createContext, useContext, useState, useEffect } from 'react';
import { corridors } from '../data/corridorsData';
import { trains } from '../data/trainsData';
import { maintenanceTasks as initialTasks } from '../data/maintenanceTasksData';
import { railwayAssets as initialAssets } from '../data/assetsData';
import { mockGeneratedBlockPlans } from '../data/blockPlansData';
import { aiRecommendations as initialRecommendations } from '../data/recommendationsData';

export const USER_ROLES = [
  { id: 'CHIEF_CONTROLLER', title: 'Chief Controller (Operations)', dept: 'Operating', icon: 'ShieldCheck' },
  { id: 'SSE_PWAY', title: 'Senior Section Engineer (P-Way)', dept: 'Engineering', icon: 'Tool' },
  { id: 'SSE_TRD', title: 'SSE (Traction / OHE)', dept: 'Electrical', icon: 'Zap' },
  { id: 'SSE_SIG', title: 'SSE (Signalling & Telecom)', dept: 'S&T', icon: 'Activity' },
  { id: 'STATION_MASTER', title: 'Station Superintendent', dept: 'Station Ops', icon: 'Radio' }
];

const RailwayContext = createContext();

export const RailwayProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    name: 'Rajesh K. Sharma',
    role: 'CHIEF_CONTROLLER',
    title: 'Chief Controller (Operations)',
    division: 'NCR - Prayagraj Division',
    badgeId: 'IRTS-9842',
    avatar: '👨‍✈️'
  });

  const [selectedCorridorId, setSelectedCorridorId] = useState('COR-NDLS-CNB');
  const [tasks, setTasks] = useState(initialTasks);
  const [assets, setAssets] = useState(initialAssets);
  const [blockPlans, setBlockPlans] = useState(mockGeneratedBlockPlans);
  const [recommendations, setRecommendations] = useState(initialRecommendations);
  const [trainsList] = useState(trains);

  // Stable IST Time helper
  const getIstTimeStr = () => {
    return new Date().toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getIstDateStr = () => {
    return new Date().toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const istTimeStr = getIstTimeStr();
  const istDateStr = getIstDateStr();

  // Active Corridor
  const selectedCorridor = corridors.find(c => c.id === selectedCorridorId) || corridors[0];

  // Toast Notification System
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  // Switch Role
  const switchRole = (roleId) => {
    const roleConfig = USER_ROLES.find(r => r.id === roleId) || USER_ROLES[0];
    setCurrentUser(prev => ({
      ...prev,
      role: roleConfig.id,
      title: roleConfig.title
    }));
    addToast(`Switched active profile to ${roleConfig.title}`, 'info');
  };

  // Add a new maintenance task
  const addTask = (newTask) => {
    const taskWithId = {
      ...newTask,
      id: `TSK-NCR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      submittedBy: currentUser.title,
      status: 'PENDING_BLOCK'
    };
    setTasks(prev => [taskWithId, ...prev]);
    addToast(`Requisition ${taskWithId.id} registered successfully`, 'success');
    return taskWithId;
  };

  // Approve a Block Plan
  const approveBlockPlan = (planId) => {
    setBlockPlans(prev => prev.map(plan => {
      if (plan.planId === planId) {
        return {
          ...plan,
          status: 'APPROVED_BY_CONTROLLER',
          approvedBy: `${currentUser.name} (${currentUser.title})`,
          approvedAt: istTimeStr + ' IST'
        };
      }
      return plan;
    }));
    addToast(`Block Plan ${planId} approved & transmitted to COIS / FOIS`, 'success');
  };

  // Add newly generated block plan
  const addGeneratedBlockPlan = (newPlan) => {
    setBlockPlans(prev => [newPlan, ...prev]);
    addToast(`New AI Block Plan generated for ${newPlan.section}`, 'success');
  };

  return (
    <RailwayContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        roles: USER_ROLES,
        selectedCorridorId,
        setSelectedCorridorId,
        selectedCorridor,
        corridors,
        trains: trainsList,
        tasks,
        setTasks,
        addTask,
        assets,
        setAssets,
        blockPlans,
        approveBlockPlan,
        addGeneratedBlockPlan,
        recommendations,
        setRecommendations,
        istTimeStr,
        istDateStr,
        toasts,
        addToast
      }}
    >
      {children}
    </RailwayContext.Provider>
  );
};

export const useRailway = () => {
  const context = useContext(RailwayContext);
  if (!context) throw new Error('useRailway must be used within RailwayProvider');
  return context;
};
