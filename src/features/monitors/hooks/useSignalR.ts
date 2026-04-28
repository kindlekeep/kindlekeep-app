import { useEffect, useRef } from 'react';
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr';
import { useMonitorStore } from '../store/useMonitorStore';

export const useSignalR = (token: string | null) => {
  const connectionRef = useRef<HubConnection | null>(null);
  
  useEffect(() => {
    if (!token) return;

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5247';

    const connection = new HubConnectionBuilder()
      .withUrl(`${apiUrl}/hubs/pulse`, {
        accessTokenFactory: () => token,
      })
      .configureLogging(LogLevel.Warning)
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    connection.on('ReceivePulse', (update) => {
      useMonitorStore.setState((state) => ({
        monitors: state.monitors.map((m) =>
          m.id === update.monitorId
            ? { ...m, currentUptimeStatus: update.newStatus, latencyMs: update.latencyMs }
            : m
        ),
      }));
    });

    const startConnection = async () => {
      try {
        await connection.start();
      } catch (error: any) {
        // Complex logic: React Strict Mode mounts components twice in development, which can abort the initial SignalR negotiation.
        if (error.name === 'AbortError' || error.message?.includes('stopped during negotiation')) {
          return; 
        }
        console.warn('SignalR connection failed:', error);
      }
    };

    startConnection();

    return () => {
      connection.stop();
    };
  }, [token]);
};