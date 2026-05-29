import { WS_BASE_URL, STORAGE_KEYS } from '@/utils/constants.js';
import { storage } from '@/utils/storage.js';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.subscriptions = new Map();
    this.messageHandlers = new Map();
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  /**
   * Connect to WebSocket with optional JWT token
   */
  connect(token) {
    return new Promise((resolve, reject) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      try {
        this.isConnecting = true;

        // Build WebSocket URL with token
        const wsUrl = token
          ? `${WS_BASE_URL}?token=${token}`
          : WS_BASE_URL;

        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.isConnecting = false;
          this.attemptReconnect(token);
        };
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  /**
   * Attempt to reconnect with exponential backoff
   */
  attemptReconnect(token) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts += 1;

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      this.connect(token).catch((err) => {
        console.error('Reconnection failed:', err);
      });
    }, delay);
  }

  /**
   * Handle incoming messages
   */
  handleMessage(data) {
    try {
      const message = JSON.parse(data);
      const { type, docId, payload } = message;

      // Call specific message handlers
      const key = `${type}:${docId}`;
      const handlers = this.messageHandlers.get(key) || [];
      handlers.forEach((handler) => {
        try {
          handler(payload);
        } catch (err) {
          console.error('Error in message handler:', err);
        }
      });
    } catch (err) {
      console.error('Error parsing WebSocket message:', err);
    }
  }

  /**
   * Subscribe to document events
   */
  subscribe(docId, messageType, handler) {
    const key = `${messageType}:${docId}`;
    const handlers = this.messageHandlers.get(key) || [];
    handlers.push(handler);
    this.messageHandlers.set(key, handlers);

    // Return unsubscribe function
    return () => {
      const idx = handlers.indexOf(handler);
      if (idx > -1) {
        handlers.splice(idx, 1);
      }
    };
  }

  /**
   * Send code edit event
   */
  sendEdit(docId, content, language, username) {
    this.send({
      type: 'EDIT',
      docId,
      payload: {
        content,
        language,
        username,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Join a document (notify server)
   */
  joinDocument(docId, username) {
    this.send({
      type: 'JOIN',
      docId,
      payload: {
        username,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Leave a document (notify server)
   */
  leaveDocument(docId, username) {
    this.send({
      type: 'LEAVE',
      docId,
      payload: {
        username,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Send cursor position
   */
  sendCursorPosition(docId, username, line, column) {
    this.send({
      type: 'CURSOR_MOVED',
      docId,
      payload: {
        username,
        line,
        column,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Generic send method
   */
  send(message) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket is not connected, cannot send message:', message);
      return;
    }

    try {
      this.ws.send(JSON.stringify(message));
    } catch (err) {
      console.error('Error sending WebSocket message:', err);
    }
  }

  /**
   * Close WebSocket connection
   */
  close() {
    this.subscriptions.clear();
    this.messageHandlers.clear();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Get connection status
   */
  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Get ready state
   */
  getReadyState() {
    return this.ws?.readyState;
  }
}

// Export singleton instance
export const wsService = new WebSocketService();
export default wsService;

