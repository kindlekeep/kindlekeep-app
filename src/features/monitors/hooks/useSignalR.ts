import { useEffect, useRef } from 'react';
import { HubConnectionBuilder, HubConnection, LogLevel, HubConnectionState } from '@microsoft/signalr';
import { useMonitorStore } from '../store/useMonitorStore';

interface UseSignalROptions {
  monitorId?: string;
  onLog?: (log: string) => void;
}

export const useSignalR = (token: string | null, options?: UseSignalROptions) => {
  const connectionRef = useRef<HubConnection | null>(null);
  const startPromiseRef = useRef<Promise<void> | null>(null);
  
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

    if (options?.onLog) {
      connection.on('ReceiveLogStream', options.onLog);
    }

    const startConnection = async () => {
      // Connection State Guard: Do not start if already connecting or connected
      if (connection.state !== HubConnectionState.Disconnected) return;

      try {
        startPromiseRef.current = connection.start();
        await startPromiseRef.current;
        
        // Subscription Logic: Only invoke after connection is established
        if (options?.monitorId && connection.state === HubConnectionState.Connected) {
          await connection.invoke('SubscribeToMonitor', options.monitorId);
        }
      } catch (error: any) {
        if (error.name === 'AbortError' || error.message?.includes('stopped during negotiation')) {
          return; 
        }
        console.warn('SignalR connection failed:', error);
      } finally {
        startPromiseRef.current = null;
      }
    };

    startConnection();

    return () => {
      const stopConnection = async () => {
        // Handle race condition: wait for start to finish before stopping
        if (startPromiseRef.current) {
          try { await startPromiseRef.current; } catch { /* ignore */ }
        }

        if (connection.state === HubConnectionState.Connected) {
          if (options?.monitorId) {
            await connection.invoke('UnsubscribeFromMonitor', options.monitorId).catch(() => {});
          }
        }
        
        if (connection.state !== HubConnectionState.Disconnected) {
          await connection.stop();
        }
      };
      
      stopConnection();
    };
  }, [token, options?.monitorId, options?.onLog]);

  return connectionRef.current;
};