import { useState, useEffect, useRef, useCallback } from 'react';

type WsStatus = 'connecting' | 'open' | 'closed' | 'error';

interface UseWebSocketReturn<T> {
  status: WsStatus;
  lastMessage: T | null;
  send: (data: T) => void;
  disconnect: () => void;
}

/**
 * WebSocket with auto-reconnect. Pass `null` to skip.
 *
 * @example
 * const { status, lastMessage, send } = useWebSocket<Msg>('wss://...');
 */
export function useWebSocket<T>(url: string | null, reconnectDelay = 3000): UseWebSocketReturn<T> {
  const [status, setStatus] = useState<WsStatus>('closed');
  const [lastMessage, setLastMessage] = useState<T | null>(null);

  const ws = useRef<WebSocket | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const manualClose = useRef(false);

  const connect = useCallback(() => {
    if (!url) return;

    const socket = new WebSocket(url);
    ws.current = socket;
    setStatus('connecting');

    socket.onopen = () => setStatus('open');
    socket.onerror = () => setStatus('error');

    socket.onmessage = (event) => {
      try {
        setLastMessage(JSON.parse(event.data as string) as T);
      } catch {
        setLastMessage(event.data as T);
      }
    };

    socket.onclose = () => {
      setStatus('closed');
      if (!manualClose.current) {
        timer.current = setTimeout(connect, reconnectDelay);
      }
    };
  }, [url, reconnectDelay]);

  const disconnect = useCallback(() => {
    manualClose.current = true;
    if (timer.current) clearTimeout(timer.current);
    ws.current?.close();
  }, []);

  const send = useCallback((data: T) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    }
  }, []);

  useEffect(() => {
    manualClose.current = false;
    connect();

    return () => {
      manualClose.current = true;
      if (timer.current) clearTimeout(timer.current);
      ws.current?.close();
    };
  }, [connect]);

  return { status, lastMessage, send, disconnect };
}
