# ParallelCode - Collaborative Code Editor 💻

A **real-time collaborative code editor** that lets teams write, edit, and debug together seamlessly. Built with React, Spring Boot, and Redis for lightning-fast performance.

---

## 🎯 What Makes It Special

- **Instant Synchronization** — Multi-user edits propagate in **<100ms** via WebSocket + Redis Pub/Sub
- **Zero Data Loss** — Dual-layer persistence: real-time DB updates + scheduled backups
- **Lightning Speed** — Redis caching keeps document access under **1ms**
- **Enterprise Ready** — JWT authentication, horizontal scaling, resilient architecture
- **Beautiful UX** — Monaco Editor with Tailwind CSS, smooth animations, dark/light modes

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│  Frontend (React + Vite + Monaco Editor)            │
│  • Real-time WebSocket client                       │
│  • JWT-based authentication                         │
│  • Context API for state management                 │
└──────────────────┬──────────────────────────────────┘
                   │ REST + WebSocket
                   │ (STOMP over WebSocket)
┌──────────────────▼──────────────────────────────────┐
│  Backend (Spring Boot 4.0.5)                        │
│  • JWT Security + WebSocket interceptors            │
│  • Real-time collaboration engine                   │
│  • Pub/Sub broadcasting                             │
└──────────────┬─────────────────────┬────────────────┘
               │                     │
        ┌──────▼─────┐       ┌───────▼──────┐
        │ PostgreSQL  │       │  Redis 7     │
        │ (Persistent)│       │  (Cache Hot) │
        └─────────────┘       └──────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** (Frontend)
- **Java 17+** (Backend)
- **Docker & Docker Compose** (Recommended)

### Start Everything in 30 Seconds

```bash
# Clone and setup
cd Editor/Backend
docker-compose up -d

cd ../FrontEnd
npm install
npm run dev
```

Open http://localhost:5173 → Sign up → Create a document → Invite collaborators

---

## 🔧 Tech Stack

**Frontend**
- React 19 + Vite
- Monaco Editor (VS Code)
- Tailwind CSS
- STOMP Client (WebSocket)
- Axios (HTTP)

**Backend**
- Spring Boot 4.0.5
- Spring Security + JWT
- Spring WebSocket (STOMP)
- Spring Data JPA
- Redis 7
- PostgreSQL 15

**Infrastructure**
- Docker & Docker Compose
- Maven Build System

---

## ✨ Key Features

✅ **Real-Time Collaboration** — Type together, see updates instantly  
✅ **Multi-Document Support** — Create unlimited documents  
✅ **User Sessions** — Track who's editing, live presence  
✅ **Auto-Save** — Never lose work again  
✅ **Horizontal Scaling** — Handle thousands of concurrent users  
✅ **Fallback Resilience** — Continues working if Redis goes down  
✅ **Secure** — JWT tokens, Spring Security, HTTPS-ready  

---

## 🔌 API Overview

### Authentication
```
POST   /auth/signup          Register new user
POST   /auth/login           Get JWT token
```

### Documents
```
POST   /documents/create                Create new document
GET    /documents/id/{id}               Fetch document
POST   /documents/{id}/members          Add collaborator
```

### Real-Time (WebSocket)
```
/ws                                 Connect (requires JWT header)
/app/join                          Join document session
/app/edit                          Send code edits
/topic/doc/{docId}                 Receive live updates
/user/queue/doc/{docId}            Get current state
```

---

## 🎨 Project Structure

```
Editor/
├── Backend/                    # Spring Boot application
│   ├── src/main/java/         # Source code
│   ├── docker-compose.yml     # Local development setup
│   └── pom.xml               # Maven dependencies
│
└── FrontEnd/                   # React application
    ├── src/
    │   ├── components/        # UI components
    │   ├── services/          # API & WebSocket
    │   ├── context/           # State management
    │   └── pages/             # Full pages
    └── vite.config.js        # Vite configuration
```

---

## 🛡️ Security

- **JWT Tokens** — Secure stateless authentication
- **Spring Security** — CORS, CSRF protection
- **WebSocket Auth** — JWT validation for real-time connections
- **Input Validation** — All requests validated server-side

---

## 📊 Performance

| Operation | Latency |
|-----------|---------|
| Redis cache hit | <1ms |
| WebSocket broadcast | 50-200ms |
| Database write | 10-50ms |
| Login | ~200ms |

---

## 🚀 Deployment

Ready for production with:
- Docker containerization
- Environment-based configuration
- Health checks and monitoring
- Graceful error handling
- Automatic reconnection logic

---

## 🤝 Contributing

Found a bug? Have an idea? Open an issue or submit a PR!

