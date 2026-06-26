# ParallelCode - Frontend (React + Vite) 💻

This is the **frontend** of **ParallelCode**, a real-time collaborative code editor. It provides a modern, responsive UI with Monaco Editor for seamless multi-user coding experiences.

---

## 📌 Overview

The frontend is built with **React 19 + Vite** and integrates with the Spring Boot backend via REST APIs and **STOMP over WebSocket** for real-time collaboration. It features a rich code editing environment powered by **Monaco Editor** (the same editor used in VS Code).

---

## ⚙️ Tech Stack

* **React 19** + **Vite** (Build tool)
* **Monaco Editor** — Full-featured code editor with syntax highlighting, IntelliSense, and themes
* **Tailwind CSS** — Utility-first styling
* **STOMP Client** — Real-time WebSocket communication
* **Axios** — HTTP client for REST API calls
* **Context API** — State management
* **React Router** — Client-side routing

---

## ✨ Key Features

* **Live Collaborative Editing** — See changes from other users in real-time
* **Rich Code Editor** — Monaco Editor with language support, themes, and minimap
* **User Presence** — See who is currently editing a document
* **Authentication** — Secure login/signup with JWT
* **Multi-Document Support** — Create and switch between multiple documents
* **Responsive Design** — Works great on desktop and tablets
* **Auto-Save & Sync** — Automatic synchronization with backend
* **Dark/Light Mode** — Beautiful modern UI

---

## 📁 Project Structure

```
frontend/
├── public/                  # Static assets
├── src/
│   ├── assets/             # Images and static files
│   ├── components/         # Reusable UI components
│   ├── pages/              # Main application pages (Editor, Auth, etc.)
│   ├── services/           # API clients, WebSocket service
│   ├── context/            # React Context providers
│   ├── utils/              # Helper functions
│   ├── styles/             # Global styles and Tailwind setup
│   ├── App.jsx
│   └── main.jsx
├── .env                    # Environment variables
├── vite.config.js          # Vite configuration
├── package.json
└── eslint.config.js

```

---

## 🚀 Setup Instructions

### Prerequisites

* **Node.js 18+**
* Backend running (see [Backend README](../Backend/README.md) or root [README.MD](../README.MD))

### Quick Start

```
# 1. Clone the repository
git clone https://github.com/JayitaSd/ParallelCode.git
cd ParallelCode/frontend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env  # (if .env.example exists)
# Edit .env with your backend URL (e.g., VITE_API_URL=http://localhost:8080)

# 4. Start the development server
npm run dev

```

---

## 🔧 Configuration

Create a .env file in the root of the frontend directory:

```
VITE_API_URL=http://localhost:8080  # Backend API URL
VITE_WS_URL=ws://localhost:8080/ws  # WebSocket URL
```

---

## 🔌 Integration with Backend

The frontend communicates with the backend in two ways:

1. **REST APIs (via Axios)**
   * Authentication (/auth/signup, /auth/login)
   * Document management (/documents/...)

2. **WebSocket (STOMP)**
   * Real-time edits and presence updates
   * Connects to /ws endpoint with JWT authentication


See the root README.MD for full API and WebSocket details

---

## 🛠️ Available Scripts

```
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 🎨 UI/UX Highlights

* Monaco Editor with customizable themes 
* Real-time cursors and user avatars (if implemented)
* Clean, minimal interface focused on code 
* Smooth animations and transitions 
* Mobile-friendly responsive layout

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request