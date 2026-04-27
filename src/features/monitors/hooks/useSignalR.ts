// src/features/monitors/hooks/useSignalR.ts
import { useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { useMonitorStore, type PulseUpdate } from '../store/useMonitorStore';

export const useSignalR = () => {
  const updatePulse = useMonitorStore((state) => state.updatePulse);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (!token) return;

    const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:5247';

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}/hubs/pulse`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connectionRef.current = connection;

    // Complex logic: Start the connection asynchronously and bind the event listener strictly
    // after the connection state transitions to connected to mitigate event race conditions.
    connection.start()
      .then(() => {
        connection.on('ReceivePulse', (update: PulseUpdate) => {
          updatePulse(update);
        });
      })
      .catch((err) => console.error(err));

    return () => {
      connection.off('ReceivePulse');
      connection.stop();
    };
  }, [updatePulse]);

  return connectionRef.current;
};