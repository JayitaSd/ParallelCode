import { useEffect, useRef, useCallback, useState } from 'react';
import { RETRY_CONFIG } from '@/utils/constants.js';

export const useWebSocket = (url, options = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);

  const wsRef = useRef(null);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef(null);
  const messageHandlersRef = useRef(new Map());

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const headers = options.headers || {};

      // For basic WebSocket, we can't set headers directly
      // We'll pass token in URL or handle via STOMP
      const wsUrlWithAuth = url;

      wsRef.current = new WebSocket(wsUrlWithAuth);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
        retryCountRef.current = 0;

        // Call onOpen callback if provided
        if (options.onOpen) {
          options.onOpen();
        }
      };

      wsRef.current.onmessage = (event) => {
        setLastMessage(event.data);

        // Call message handlers
        messageHandlersRef.current.forEach((handler) => {
          try {
            handler(event.data);
          } catch (err) {
            console.error('Error in WebSocket message handler:', err);
          }
        });

        if (options.onMessage) {
          options.onMessage(event.data);
        }
      };

      wsRef.current.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('WebSocket error occurred');

        if (options.onError) {
          options.onError(event);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);

        if (options.onClose) {
          options.onClose();
        }

        // Attempt to reconnect with exponential backoff
        if (options.reconnect !== false) {
          attemptReconnect();
        }
      };
    } catch (err) {
      console.error('Error creating WebSocket:', err);
      setError(err.message);
      attemptReconnect();
    }
  }, [url, options]);

  const attemptReconnect = useCallback(() => {
    if (retryCountRef.current >= RETRY_CONFIG.MAX_RETRIES) {
      setError('Max reconnection attempts reached');
      return;
    }

    const delay = Math.min(
      RETRY_CONFIG.INITIAL_DELAY * Math.pow(RETRY_CONFIG.BACKOFF_MULTIPLIER, retryCountRef.current),
      RETRY_CONFIG.MAX_DELAY
    );

    console.log(`Retrying WebSocket connection in ${delay}ms (attempt ${retryCountRef.current + 1})`);
    retryCountRef.current += 1;

    retryTimeoutRef.current = setTimeout(() => {
      connect();
    }, delay);
  }, [connect]);

  const send = useCallback((data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(typeof data === 'string' ? data : JSON.stringify(data));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  const addMessageHandler = useCallback((id, handler) => {
    messageHandlersRef.current.set(id, handler);
    return () => {
      messageHandlersRef.current.delete(id);
    };
  }, []);

  const close = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      close();
    };
  }, [connect, close]);

  return {
    isConnected,
    lastMessage,
    error,
    send,
    addMessageHandler,
    close,
    ws: wsRef.current,
  };
};

