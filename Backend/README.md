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

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| POST   | /api/auth/signup | Register a new user |
| POST   | /api/auth/login  | Authenticate user   |

### Room APIs

| Method | Endpoint         | Description                     |
| ------ | ---------------- | ------------------------------- |
| POST   | /api/room/create | Create a new collaboration room |
| GET    | /api/room/{id}   | Get room details                |

---

## 🔄 WebSocket Endpoints

* **/ws** → WebSocket connection endpoint
* **/topic/code/{roomId}** → Broadcast code updates
* **/app/code** → Send code changes

### Flow

1. Client connects to `/ws`
2. Subscribes to `/topic/code/{roomId}`
3. Sends updates to `/app/code`
4. Server broadcasts updates to all connected clients

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

## 📌 Future Enhancements

* 🌐 Multi-language execution support
* 📊 Version history & diff tracking
* 🤖 AI code suggestions
* 🧑‍💼 Role-based permissions (owner/editor/viewer)

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License.

---

## 💡 Notes

* Ensure WebSocket is enabled on frontend
* JWT must be attached in headers for secured REST APIs
* Handle reconnect logic on client for better UX
