# 🚀 DevBoard – Multi-Tenant Developer Collaboration Platform

DevBoard is a modern **multi-tenant developer collaboration platform**, designed to streamline task management, team coordination, and project tracking for software teams. With a clean UI, powerful admin features, and robust tenant isolation, DevBoard is ideal for distributed or growing teams.

## 🧩 Features

https://www.stackflowy.com

### ✅ Core Features
- 🔐 **Multi-Tenant Isolation**: Each tenant has completely separate users, projects, and data.
- 🧑‍💻 **User Roles**: Supports `Admin` and `Member` roles, with fine-grained access control.
- 📋 **Task Management**: Create, edit, filter, and sort tasks by status, priority, or update time.
- 🧵 **Comment System**: Add, delete, and reply to task-related comments with pagination.
- 📌 **Project Selector**: Isolate task views and actions per project.
- 🗂 **Board View** (Trello-style): Drag-and-drop tasks between columns (`ToDo`, `InProgress`, `Done`).
- 🔍 **Search & Filter**: Real-time search and status filters.
- 🌐 **Admin Panel**: Admins can manage all users, tasks, comments, and projects under their tenant.

### 🛡️ Security & Permissions
- JWT-based authentication
- Role-based access (admin/member)
- Full tenant validation for all operations (backend enforced)

---

## 🛠️ Tech Stack

### Frontend
- React + TypeScript
- Vite
- TailwindCSS
- @dnd-kit (for Kanban)
- Axios
- React Router
- Context API

### Backend
- Spring Boot (Java)
- Spring Security + JWT
- PostgreSQL (RDS)
- JPA / Hibernate
- Maven

### DevOps
- Terraform (AWS EC2, VPC, RDS)
- GitHub Actions (CI/CD)
- Nginx + Certbot (HTTPS)
- EC2 hosting backend & frontend

---

## 🏗️ System Architecture

```
               ┌────────────────────────────┐
               │   Frontend (React + Vite)  │
               └────────────┬───────────────┘
                            │  Axios HTTP
                            ▼
               ┌────────────────────────────┐
               │   Backend (Spring Boot)    │
               └────────────┬───────────────┘
                            │  JPA / REST API
                            ▼
               ┌────────────────────────────┐
               │ PostgreSQL (AWS RDS)       │
               └────────────┬───────────────┘
                            │  provisioned by
                            ▼
               ┌────────────────────────────┐
               │ AWS Infrastructure (IaC)   │
               │    Terraform Managed       │
               └────────────────────────────┘
```


---

## 📦 Project Structure

```
devboard-frontend/
├── public/
├── src/
│   ├── components/         # Reusable UI components (TaskCard, TaskForm, etc.)
│   ├── contexts/           # React Contexts (UserContext, TaskContext)
│   ├── pages/              # Route pages (MainPage, BoardView, AdminPanel)
│   ├── types.ts            # Shared TypeScript interfaces
│   └── main.tsx            # App entry
├── index.html
├── tailwind.config.js
└── vite.config.ts

devboard-backend/
├── src/
│   └── main/
│       ├── java/com/devboard/
│       │   ├── controller/     # REST Controllers
│       │   ├── model/          # JPA Entities (User, Task, Comment, Project)
│       │   ├── repository/     # JPA Repositories
│       │   ├── security/       # JWT, AuthUtil, TenantGuard
│       │   ├── service/        # Business logic
│       │   └── DevboardBackendApplication.java
│       └── resources/
│           └── application.properties
├── pom.xml                   # Maven config
└── Dockerfile (optional)
```

---

## 🚀 Getting Started

### 1. Clone the Repo

git clone https://github.com/your-username/devboard.git
cd devboard

### 2. Backend Setup

cd devboard-backend
./mvnw spring-boot:run

Or build:

./mvnw clean install
java -jar target/devboard-backend-*.jar

Set your `application.properties`:

spring.datasource.url=jdbc:postgresql://<db-host>:5432/devboarddb
spring.datasource.username=postgres
spring.datasource.password=yourpassword
jwt.secret=your-secret-key

### 3. Frontend Setup

cd devboard-frontend
npm install
npm run dev

Visit http://localhost:5173


---

## 🧪 Usage Flow

- Register as admin (via `/register` with new tenantId)
- Login to access AdminPanel
- Create users (admin/member) under same tenant
- Create projects
- Create/manage tasks under project
- Comment on tasks, view threaded replies
- Drag & drop tasks in Board View (`/board`)

---

## 🔐 Tenant Policy

| Action                    | Admin        | Member       |
|--------------------------|--------------|--------------|
| Register Tenant          | ✅ (/register) | ❌            |
| Access Admin Panel       | ✅           | ❌            |
| Create Users             | ✅ (same tenant) | ❌        |
| CRUD Tasks/Projects      | ✅           | ✅            |
| Comment & View Tasks     | ✅           | ✅            |

---


## 📜 License

This project is licensed under the MIT License. See `LICENSE` file for details.

---

## 👨‍💻 Author

Built by ZiYang Zhou
GitHub: https://github.com/sheep177/devboard-infra
 or https://www.stackflowy.com