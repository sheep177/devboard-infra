# DevBoard ✨

This is a full-stack **multi-tenant task management platform** for developers and teams. Featuring Kanban board, comment system, role-based access control, and admin panel.

---

## 📄 Features

### ✅ General Users (Members)

* Register / Login with JWT authentication
* Create / edit / delete tasks
* Filter by status (ToDo / In Progress / Done)
* Filter by priority (Low / Medium / High)
* Search tasks by keyword
* Paginated task display
* Sort tasks by title / status / priority / created / updated
* View task details and comment
* Comment editing / deletion (by self)
* Kanban board (drag & drop between columns)

### 🛡† Admin Users

* Everything Members can do
* Access to Admin Panel

  * View & delete all tasks
  * View & delete all comments
  * View & delete members

---

## ⚙️ Tech Stack

### Frontend

* React 19 + Vite
* TypeScript
* Tailwind CSS
* @dnd-kit/core (for drag-and-drop Kanban)

### Backend

* Spring Boot (Java)
* Spring Security + JWT
* PostgreSQL
* RESTful API with role-based access

### DevOps

* API URL proxied via `/api`
* CORS configured for local frontend (`localhost:5173`)
* Uses React Context (UserContext + TaskContext) for global state

---

## 🌐 Live Demo (if deployed)

**Coming Soon** (or add your Render/Vercel link)

---

## 🔧 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/sheep177/devboard.git
cd devboard
```

### 2. Backend Setup

```bash
cd devboard-backend
./mvnw spring-boot:run
```

* Make sure PostgreSQL is running and configured in `application.properties`
* Default port: `8080`

### 3. Frontend Setup

```bash
cd devboard-frontend
npm install
npm run dev
```

* Runs at `http://localhost:5173`

### 4. Admin Login

* Username: `admin`
* Password: `admin`

---

## 🖊† Architecture Overview

```text
React Frontend (Vite) —➔ REST API —➔ Spring Boot —➔ PostgreSQL
                             ↳ /tasks
                             ↳ /comments
                             ↳ /auth/login, /auth/register
                             ↳ /admin panel endpoints
```

---

## 👷 Roles & Permissions

| Role   | Task CRUD | Comment  | Admin Panel |
| ------ | --------- | -------- | ----------- |
| Member | Yes       | Own only | No          |
| Admin  | Yes       | All      | Yes         |

---

## ✨ Highlights

* JWT-based stateless login system
* Custom `TaskContext` and `UserContext` for global state management
* Secure API endpoints (Spring Security filters)
* Modular, scalable frontend architecture
* Clean Tailwind UI
* Drag-and-drop implemented with `@dnd-kit/core`
* Pagination for performance

---

## 📁 Future Improvements

* Image/file attachments to tasks
* Email notifications
* Real-time updates via WebSocket
* CI/CD deployment
* User password reset flow

---

## 🙌 Author

Built with ❤️ by Ethan Z (ZiYang Zhou)
