# 🧠 Collaborative Code Editor - Backend (Spring Boot)

## 📌 Overview

This is the backend service for a **Real-Time Collaborative Code Editor** built using **Spring Boot**. It handles authentication, session management, real-time collaboration, and code synchronization between multiple users.

---

## ⚙️ Tech Stack

* **Java 17**
* **Spring Boot**
* **Spring Security + JWT** (Authentication & Authorization)
* **WebSocket (STOMP protocol)** for real-time communication
* **Spring Data JPA**
* **PostGreSql**
* **Lombok**
* **Maven**

---

## 🚀 Features

* 🔐 User Authentication (Signup/Login with JWT)
* 🧑‍🤝‍🧑 Multi-user collaboration in real-time
* 📝 Live code synchronization via WebSockets
* 📂 Room/Session-based editing
* 💾 Persistent storage of users and sessions
* 🔄 Auto-reconnect and state sync

---

## 📁 Project Structure

```
src/main/java/com/example/backend

│
├── cache        
├── config            # App Configurations 
├── controller        # REST Controllers
├── dto               # Request/Response DTOs
├── entity            # Database Entities
├── repo              # JPA Repositories
├── security          # JWT + Security Config
├── services          # Business Logic
├── util          
└── websocket         # WebSocket Config & Handlers
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
* PostGreSql

### Steps

```bash
# Clone the repo
git clone https://github.com/JayitaSd/ParallelCode/Backend.git
cd Backend

# Configure database in application.properties

spring.datasource.url=jdbc:postgresql://localhost:5432/Ide
spring.datasource.username=root
spring.datasource.password=your_password

# Build & Run
mvn clean install
mvn spring-boot:run
```

---

## ⚡ Environment Variables

| Variable       | Description                |
| -------------- | -------------------------- |
| JWT_SECRET     | Secret key for signing JWT |
| JWT_EXPIRATION | Token expiry time          |

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
