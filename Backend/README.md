# 🧠 Collaborative Code Editor - Backend (Spring Boot)

## 📌 Overview

This is the backend service for a **Real-Time Collaborative Code Editor** built using **Spring Boot**. It handles authentication, session management, real-time collaboration, code synchronization, and uses a **Redis + PostgreSQL** architecture for optimal performance and scalability.

---

## ⚙️ Tech Stack

* **Java 17**
* **Spring Boot 4.0.5**
* **Spring Security + JWT** (Authentication & Authorization)
* **WebSocket (STOMP protocol)** for real-time communication
* **Spring Data JPA** (Database ORM)
* **PostgreSQL** (Persistent Database)
* **Redis 7** (In-Memory Cache & Pub/Sub)
* **Maven**
* **Docker & Docker Compose** (Containerization)

---

## 🚀 Features

* 🔐 User Authentication (Signup/Login with JWT)
* 🧑‍🤝‍🧑 Multi-user real-time collaboration
* 📝 Live code synchronization via WebSockets
* ⚡ Ultra-fast caching with Redis (sub-millisecond access)
* 💾 Automatic persistence to PostgreSQL
* 🔄 Distributed Pub/Sub for multi-instance scaling
* 👥 User session tracking per document
* 📡 Real-time broadcast to all active editors
* 🛡️ Automatic fallback to database if cache fails
* 📊 Document state synchronization across instances

---

## 📁 Project Structure

```
src/main/java/com/example/backend
│
├── config/                     # App Configurations
│   ├── RedisConfig.java       # Redis connection & pub/sub setup
│   ├── SecurityConfig.java    # JWT & Spring Security config
│   └── WebSocketConfig.java   # WebSocket STOMP configuration
│
├── controller/                 # REST Controllers
│   ├── AuthController.java    # Login/Signup endpoints
│   ├── DocumentController.java # Document REST endpoints
│   └── TestController.java    # Test/protected routes
│
├── dto/                        # Request/Response DTOs
│   ├── auth/                  # Auth DTOs
│   ├── document/              # Document DTOs
│   └── websocket/
│       ├── EditMessage.java   # WebSocket edit message
│       └── RedisDocMessage.java # Redis pub/sub message
│
├── entity/                     # JPA Entities
│   ├── Document.java          # Document entity
│   ├── DocumentMember.java    # Document members
│   └── User.java              # User entity
│
├── redis/                      # Redis operations
│   ├── RedisPublisher.java    # Publish to Redis channels
│   ├── RedisSubscriber.java   # Subscribe to Redis channels
│   └── RedisMessageListener.java # Forward Redis msgs to WebSocket
│
├── repo/                       # JPA Repositories
│   ├── DocRepo.java           # Document repository
│   └── UserRepo.java          # User repository
│
├── scheduler/                  # Scheduled Tasks
│   └── DocSaveScheduler.java  # Periodic Redis→DB persistence
│
├── security/                   # Security Components
│   ├── JwtUtil.java           # JWT token generation/validation
│   ├── JwtFilter.java         # JWT authentication filter
│   └── StompPrincipal.java    # WebSocket principal
│
├── service/                    # Business Logic
│   ├── AuthService.java       # Authentication logic
│   ├── DocumentService.java   # Document operations with Redis caching
│   ├── RedisDocService.java   # Redis cache operations
│   ├── DocPersistenceService.java # Database persistence
│   └── DocCollabService.java  # Collaboration logic (edits, join, leave)
│
└── websocket/                  # WebSocket Handlers
    ├── DocWebSocketController.java # Message handlers
    ├── DocumentSessionRegistry.java # Track active sessions
    └── WebSocketAuthInterceptor.java # JWT validation for WebSocket
```

---

## 🔑 Authentication Flow

1. User signs up or logs in
2. Server validates credentials
3. JWT token is generated and returned
4. Client sends JWT in headers for secured endpoints

---

## 🔌 API Endpoints

### Auth APIs

| Method | Endpoint    | Description         |
| ------ | ----------- | ------------------- |
| POST   | /auth/signup | Register a new user |
| POST   | /auth/login | Authenticate user   |

### Document APIs

| Method | Endpoint                 | Description                          |
| ------ | ------------------------ | ------------------------------------ |
| POST   | /documents/create        | Create a new document                |
| GET    | /documents/id/{id}       | Get document details by id           |
| POST   | /documents/{id}/members  | Add a member to a document (query param: `username`) |
| GET    | /test                    | Test protected route                 |

---

## 🔄 WebSocket Endpoints

* **/ws** → STOMP WebSocket handshake endpoint (requires `Authorization: Bearer <token>` header)
* **/app/edit** → Send document edits to server
* **/app/join** → Join a document session and request current content
* **/topic/doc/{docId}** → Broadcast latest document content to all subscribers
* **/user/queue/doc/{docId}** → Send current document state only to the joining user

### Flow

1. Client connects to `/ws` with JWT in `Authorization` header.
2. Client subscribes to `/topic/doc/{docId}` for live updates.
3. Client sends join event to `/app/join` to fetch current content.
4. Server replies to that user on `/user/queue/doc/{docId}`.
5. Client sends edits to `/app/edit`.
6. Server broadcasts updates to `/topic/doc/{docId}`.

---

## 🛠️ Setup Instructions

### Prerequisites

* Java 17+
* Maven
* Docker & Docker Compose
* PostgreSQL (or use Docker)
* Redis (or use Docker)

### Quick Start with Docker

```bash
# Clone the repo
git clone https://github.com/JayitaSd/ParallelCode/Backend.git
cd Backend

# Build the project
mvn clean install -DskipTests

# Start all services (PostgreSQL + Redis + Spring Boot)
docker-compose up -d

# Check logs
docker-compose logs -f app
```

### Manual Setup (Local Development)

```bash
# 1. Ensure PostgreSQL is running
# Configure in application.properties:
spring.datasource.url=jdbc:postgresql://localhost:5432/Ide
spring.datasource.username=postgres
spring.datasource.password=your_password

# 2. Ensure Redis is running on localhost:6379
# OR start with Docker:
docker run -d -p 6379:6379 --name redis_cache redis:7-alpine

# 3. Build & Run
mvn clean install -DskipTests
mvn spring-boot:run
```

### Docker Compose Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Access PostgreSQL
docker-compose exec postgres psql -U postgres -d Ide

# Access Redis CLI
docker-compose exec redis redis-cli
```

---

## ⚡ Configuration

### Redis Configuration

```properties
spring.data.redis.host=localhost
spring.data.redis.port=6379
```

### Document Persistence

```properties
app.document.persistence.enabled=true
app.document.persistence.interval=30000  # 30 seconds
```

### JWT Configuration

```properties
jwt.secret=your_jwt_secret_key_here
jwt.expiration=3600000  # 1 hour in milliseconds
```

### Environment Variables

| Variable       | Description                |
| -------------- | -------------------------- |
| JWT_SECRET     | Secret key for signing JWT |
| JWT_EXPIRATION | Token expiry time (ms)     |
| SPRING_DATA_REDIS_HOST | Redis server host |
| SPRING_DATA_REDIS_PORT | Redis server port |

---

## 🧪 Testing

Use tools like **Postman** or **cURL**:

* Test authentication endpoints
* Use WebSocket clients (e.g., browser or tools like Hoppscotch) for real-time features

---

## 💡 Notes

* Ensure WebSocket is enabled on frontend
* JWT must be attached in headers for secured REST APIs
* Handle reconnect logic on client for better UX
* Redis automatically expires documents after 24 hours
* Documents are persisted to PostgreSQL in real-time and on user disconnect
* Multiple instances can scale horizontally using Redis Pub/Sub

---
