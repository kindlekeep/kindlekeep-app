// src/pages/Dashboard.tsx
import { useEffect } from 'react';
import { api } from '../lib/axios';
import { motion } from 'framer-motion';
import { useMonitorStore } from '../features/monitors/store/useMonitorStore';
import { useSignalR } from '../features/monitors/hooks/useSignalR';
import { MonitorCard } from '../features/monitors/components/MonitorCard';
import { AddMonitorModal } from '../features/monitors/components/AddMonitorModal';

export const Dashboard = () => {
  const token = localStorage.getItem('jwt_token');
  
  // The useSignalR hook handles the global telemetry subscription (ReceivePulse) 
  // and now includes a lifecycle guard to prevent race conditions.
  useSignalR(token);
  
  const { monitors, setMonitors } = useMonitorStore();

  useEffect(() => {
    const fetchMonitors = async () => {
      try {
        const response = await api.get('/api/monitors');
        setMonitors(response.data);
      } catch (error) {
        console.error('Initial payload telemetry fetch failed:', error);
      }
    };

    fetchMonitors();
  }, [setMonitors]);


  return (
    <div className="min-h-screen bg-zinc-950 p-8 text-zinc-100 font-sans">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-wordmark text-3xl tracking-wide text-zinc-100 lowercase">kindlekeep</h1>
          <h2 className="font-heading text-xl font-black mt-2 text-zinc-300">Command Center</h2>
        </div>
        <AddMonitorModal />
      </header>

      <motion.div 
        layout 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {monitors.map((monitor) => (
          <MonitorCard key={monitor.id} monitor={monitor} />
        ))}
        {monitors.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-zinc-500 border border-dashed border-zinc-800 bg-zinc-900/50">
            <p className="font-sans uppercase tracking-widest text-sm">No Active Targets</p>
            <p className="text-xs font-mono mt-2">Deploy a monitor to commence telemetry.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};