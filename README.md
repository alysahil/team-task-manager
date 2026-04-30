# 🚀 TaskFlow — Team Task Manager

A full-stack Team Task Manager web application built with **Node.js**, **React**, and **PostgreSQL**, featuring role-based access control, Kanban-style task tracking, and a real-time commenting system.

![TaskFlow](https://img.shields.io/badge/Status-Live-brightgreen) ![Node](https://img.shields.io/badge/Node.js-18+-green) ![React](https://img.shields.io/badge/React-18-blue) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)

---

## 🌐 Live Demo

**Live URL:** `https://team-task-manager-production-b7cb.up.railway.app`

**GitHub Repository:** `https://github.com/alysahil/team-task-manager`

---

## 📸 Features

### 🔐 Authentication
- Secure **JWT-based** Login & Registration
- Password hashing with **bcryptjs**
- Role selection on signup: **Admin** or **Member**

### 👥 Role-Based Access Control (RBAC)
| Feature | Admin | Member |
|---|---|---|
| Create Projects | ✅ | ❌ |
| Create Tasks | ✅ | ❌ |
| Assign Tasks to Users | ✅ | ❌ |
| Update Task Status | ✅ (any task) | ✅ (assigned tasks only) |
| Add Comments | ✅ (any task) | ✅ (assigned tasks only) |
| View All Projects & Tasks | ✅ | ✅ |

### 📋 Task Management
- **Kanban Board** with 4 columns: `To Do` → `In Progress` → `In Review` → `Completed`
- Task **due dates** with overdue highlighting
- Task **assignment** to specific team members
- Task **Details Modal** with full comment thread

### 💬 Comments System
- Members can comment on tasks assigned to them
- Admins can comment on any task
- Timestamps and role badges on each comment
- Permission message shown for unauthorized users

### 📊 Dashboard
- Live counts of Pending, In Progress, Completed tasks
- **Overdue task** detection and display
- Recent task activity feed

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite, Vanilla CSS, Lucide Icons |
| **Backend** | Node.js + Express.js |
| **Database** | PostgreSQL (via Railway) |
| **ORM** | Prisma |
| **Auth** | JSON Web Tokens (JWT) + bcryptjs |
| **Deployment** | Railway (full-stack monorepo) |

---

## 🗄️ Database Schema

```
User          Project         Task            Comment
────────      ──────────      ──────────      ──────────
id            id              id              id
name          name            title           content
email         description     description     taskId → Task
password      ownerId → User  status          userId → User
role          createdAt       dueDate         createdAt
createdAt                     projectId → Project
                              assigneeId → User
                              createdAt
```

### Task Status Flow
```
PENDING / TODO → IN_PROGRESS → IN_REVIEW → COMPLETED
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js v18+
- npm v9+
- PostgreSQL database (or use SQLite for local dev)

### 1. Clone the Repository
```bash
git clone https://github.com/alysahil/team-task-manager.git
cd team-task-manager
```

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Configure Environment Variables
Create `server/.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskflow"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
```

### 4. Run Database Migrations
```bash
cd server
npx prisma db push
```

### 5. Start the Development Servers

**Backend** (from `server/` directory):
```bash
node server.js
```

**Frontend** (from `client/` directory):
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🌐 Deployment (Railway)

This project is configured for one-click deployment on Railway.

### Steps:
1. Fork this repository to your GitHub account
2. Go to [Railway.app](https://railway.app) and create a new project
3. Click **Provision PostgreSQL** to add a database
4. Click **New → GitHub Repo** and select this repository
5. In the service **Variables** tab, add:
   - `DATABASE_URL` → link to your Postgres service
   - `JWT_SECRET` → any random secret string
6. Railway will automatically build and deploy the app

The start command runs `prisma db push` automatically before starting the server, so no manual migrations are needed.

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | None | Register a new user |
| POST | `/api/auth/login` | None | Login and get JWT |
| GET | `/api/auth/me` | JWT | Get current user |

### Projects
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/projects` | JWT | Get all projects |
| POST | `/api/projects` | JWT + Admin | Create a project |

### Tasks
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/tasks` | JWT | Get all tasks (with comments) |
| POST | `/api/tasks` | JWT + Admin | Create a task |
| PUT | `/api/tasks/:id/status` | JWT + Owner/Admin | Update task status |
| POST | `/api/tasks/:id/comments` | JWT + Assignee/Admin | Add a comment |

### Users
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users` | JWT | Get all users (for assignment) |

---

## 📁 Project Structure

```
team-task-manager/
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Auth.jsx       # Login / Register page
│   │   │   ├── Dashboard.jsx  # Overview stats
│   │   │   ├── Projects.jsx   # Project list
│   │   │   └── Tasks.jsx      # Kanban board + modals
│   │   ├── App.jsx            # Router setup
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global design system
│   └── vite.config.js
│
├── server/                    # Express backend
│   ├── prisma/
│   │   └── schema.prisma      # DB models & enums
│   ├── server.js              # All API routes
│   └── package.json
│
├── package.json               # Root scripts (build + start)
├── railway.json               # Railway deployment config
└── README.md
```

---

## 🎯 Assignment Requirements Checklist

- [x] **Authentication** — JWT-based signup/login
- [x] **Project & Team Management** — Admin creates projects, all users view them
- [x] **Task Creation, Assignment & Status Tracking** — Full Kanban workflow
- [x] **Dashboard** — Live metrics including overdue tasks
- [x] **REST APIs** — Full RESTful backend with Express.js
- [x] **PostgreSQL Database** — Managed via Prisma ORM
- [x] **Proper Validations & Relationships** — FK constraints, bcrypt, JWT validation
- [x] **Role-Based Access Control** — Admin vs Member permissions enforced at API level
- [x] **Deployed on Railway** — Live and fully functional

---

## 👨‍💻 Author

**Sahil** — [@alysahil](https://github.com/alysahil)
