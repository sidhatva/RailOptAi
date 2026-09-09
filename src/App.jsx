import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { RailwayProvider } from './context/RailwayContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { BlockPlanningPage } from './pages/BlockPlanningPage';
import { MaintenanceTasksPage } from './pages/MaintenanceTasksPage';
import { RailwayAssetsPage } from './pages/RailwayAssetsPage';
import { TrainsCorridorsPage } from './pages/TrainsCorridorsPage';
import { WeeklyPlannerPage } from './pages/WeeklyPlannerPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { LoginPage } from './pages/LoginPage';

// Error Boundary Component to prevent white/blank screens
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("RailOpt AI Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#080C14] text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-[#0E1626] border border-red-500/40 rounded-2xl p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-red-900/40 border border-red-500 text-red-400 flex items-center justify-center mx-auto mb-4 font-bold text-xl font-mono">
              !
            </div>
            <h2 className="text-base font-bold text-white mb-1">
              RailOpt Control Console Recovered
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              An unexpected render exception was trapped to maintain control room stability.
            </p>
            <div className="p-3 bg-black/40 rounded-lg text-left font-mono text-[11px] text-red-300 mb-4 overflow-x-auto">
              {this.state.error?.message || 'Interface Render Error'}
            </div>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-red-700 to-red-800 text-white text-xs font-bold rounded-xl shadow-lg hover:from-red-600 transition-all"
            >
              Reload Operational Dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const navigateToPlanningWithTask = (task) => {
    setActivePage('ai-planning');
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage onNavigate={setActivePage} />;
      case 'ai-planning':
        return <BlockPlanningPage />;
      case 'maintenance-tasks':
        return <MaintenanceTasksPage onNavigateToPlanning={navigateToPlanningWithTask} />;
      case 'railway-assets':
        return <RailwayAssetsPage />;
      case 'trains-corridors':
        return <TrainsCorridorsPage />;
      case 'planner':
        return <WeeklyPlannerPage />;
      case 'recommendations':
        return <RecommendationsPage onNavigateToPlanning={() => setActivePage('ai-planning')} />;
      case 'reports':
        return <ReportsPage />;
      case 'login':
        return <LoginPage onLoginSuccess={() => setActivePage('dashboard')} />;
      default:
        return <DashboardPage onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#070B12] text-slate-900 dark:text-slate-100 flex flex-col w-full overflow-x-hidden selection:bg-red-700 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

      {/* Main Layout Body */}
      <div className="flex-1 flex w-full relative">
        {/* Responsive Sidebar */}
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dynamic Page Content */}
        <main
          className={`flex-1 min-w-0 transition-[padding] duration-200 ease-in-out ${
            isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
          } w-full`}
        >
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {renderActivePage()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <RailwayProvider>
          <AppContent />
        </RailwayProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
