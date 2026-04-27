// src/features/monitors/components/MonitorCard.tsx
import { Activity, Shield, Globe } from 'lucide-react';
import { type MonitorResponse, UptimeStatus } from '../store/useMonitorStore';
import { KindleCard } from '../../../components/ui/KindleCard';

interface MonitorCardProps {
  monitor: MonitorResponse;
}

export const MonitorCard = ({ monitor }: MonitorCardProps) => {
  return (
    <KindleCard isActive={monitor.isActive}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Globe strokeWidth={1} className="w-5 h-5 text-blue-500" />
          <h3 className="font-heading font-bold text-sm truncate w-48 text-zinc-100">
            {monitor.friendlyName}
          </h3>
        </div>
        <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 font-sans">
          {UptimeStatus[monitor.currentUptimeStatus]}
        </span>
      </div>

      <p className="text-xs text-zinc-400 font-mono mb-6 truncate">
        {monitor.url}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2 text-zinc-300">
          <Activity strokeWidth={1} className="w-4 h-4 text-iris-400" />
          <span className="text-sm font-mono">
            {monitor.latencyMs != null ? `${monitor.latencyMs}ms` : '---'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-zinc-300">
          <Shield strokeWidth={1} className="w-4 h-4 text-iris-400" />
          <span className={`text-sm font-bold font-mono ${
            monitor.currentSecurityGrade === 'A' ? 'text-green-500' : 'text-zinc-100'
          }`}>
            {monitor.currentSecurityGrade}
          </span>
        </div>
      </div>
    </KindleCard>
  );
};