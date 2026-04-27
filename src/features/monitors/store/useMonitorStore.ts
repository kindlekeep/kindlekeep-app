// src/features/monitors/store/useMonitorStore.ts
import { create } from 'zustand';

export enum UptimeStatus {
  Healthy = 0,
  Down = 1,
  Degraded = 2
}

export interface MonitorResponse {
  id: string;
  url: string;
  friendlyName: string;
  currentUptimeStatus: UptimeStatus;
  currentSecurityGrade: string;
  isActive: boolean;
  latencyMs?: number;
}

export interface PulseUpdate {
  monitorId: string;
  newStatus: UptimeStatus;
  latencyMs: number;
}

export interface MonitorState {
  monitors: MonitorResponse[];
  setMonitors: (monitors: MonitorResponse[]) => void;
  updatePulse: (update: PulseUpdate) => void;
}

export const useMonitorStore = create<MonitorState>((set) => ({
  monitors: [],
  setMonitors: (monitors) => set({ monitors }),
  updatePulse: (update) => set((state) => ({
    monitors: state.monitors.map((m) =>
      m.id === update.monitorId
        ? { ...m, currentUptimeStatus: update.newStatus, latencyMs: update.latencyMs }
        : m
    )
  }))
}));