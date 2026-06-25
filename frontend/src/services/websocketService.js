import { Client } from "@stomp/stompjs";
import { WS_BASE_URL } from "../utils/constants.js";
import storage from "../utils/storage.js"; // adjust path if needed
import {STORAGE_KEYS} from "../utils/constants.js";

class WebSocketService {
  constructor() {
    this.client = null;
    this.subscriptions = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      // ✅ In websocketService.js connect():
      const token = localStorage.getItem("token");  // match what Login.jsx saves
      if (!token) {
        reject(new Error('No auth token found'));
        return;
      }

      if (this.client && this.client.connected) {
        resolve();
        return;
      }

      this.client = new Client({
        brokerURL: `${WS_BASE_URL}/ws`,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        debug: (str) => console.log('STOMP:', str),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      this.client.onConnect = () => {
        console.log('✅ STOMP WebSocket Connected');
        resolve();
      };

      this.client.onStompError = (frame) => {
        console.error('STOMP Error:', frame);
        reject(frame);
      };

      this.client.onWebSocketError = (event) => {
        console.error('WebSocket Error:', event);
      };

      this.client.activate();
    });
  }

  subscribeToDocument(docId, callback) {
    if (!this.client?.connected) return null;

    const subscription = this.client.subscribe(`/topic/doc/${docId}`, (message) => {
      try {
        callback(JSON.parse(message.body));
      } catch (e) {
        console.error('Error parsing WS message:', e);
      }
    });

    this.subscriptions.set(docId, subscription);
    return subscription;
  }

  sendEdit(docId, content, language, username) {
    if (this.client?.connected) {
      this.client.publish({
        destination: `/app/edit/${docId}`,
        body: JSON.stringify({ content, language, username, timestamp: new Date().toISOString() }),
      });
    }
  }

  joinDocument(docId, username) {
    if (this.client?.connected) {
      this.client.publish({
        destination: `/app/join/${docId}`,
        body: JSON.stringify({ username, timestamp: new Date().toISOString() }),
      });
    }
  }

  disconnect() {
    if (this.client) {
      this.subscriptions.forEach(sub => sub.unsubscribe?.());
      this.subscriptions.clear();
      this.client.deactivate();
      this.client = null;
    }
  }
}

export const wsService = new WebSocketService();
export default wsService;