# TaskFlow - Team Task Manager (Full-Stack)

TaskFlow is a premium, full-stack team task manager built with React, Node.js, Express, and PostgreSQL (via Prisma). It features an ultra-modern aesthetic with glassmorphism, dynamic gradients, and role-based access control.

## 🚀 Features

- **Authentication**: Secure Signup/Login using JWT.
- **Role-Based Access**: 
  - **Admin**: Can create projects, create tasks, assign users, and update any task.
  - **Member**: Can view projects, view tasks, and update the status of their assigned tasks.
- **Premium UI**: Built with Vanilla CSS utilizing CSS variables, glassmorphism (`backdrop-filter`), micro-animations, and responsive layouts without Tailwind.
- **Dashboard**: Real-time overview of tasks (Pending, In Progress, Completed, Overdue) and active projects.
- **Project Management**: Create and oversee multiple projects.
- **Task Management**: Create tasks, assign members, set due dates, and update statuses using a Kanban-style list approach.

## 🛠️ Tech Stack

- **Frontend**: Vite + React + React Router + Vanilla CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT & bcryptjs

---

## 🏃‍♂️ Running Locally

1. **Prerequisites**: Node.js (v18+) and a running PostgreSQL instance.
2. **Install Dependencies**:
   ```bash
   npm run install:all
   ```
3. **Database Setup**:
   - Create a PostgreSQL database.
   - Rename `server/.env.example` to `server/.env` and update the `DATABASE_URL`.
   - Run migrations:
     ```bash
     cd server
     npx prisma db push
     ```
4. **Start Development Servers**:
   - Open two terminal windows.
   - **Terminal 1 (Backend)**: `cd server && npm start` (or use nodemon if installed)
   - **Terminal 2 (Frontend)**: `cd client && npm run dev`

---

## 🌐 Deploying to Railway (Mandatory Requirement)

Since you don't have a Railway account yet, deploying is extremely easy and free. Follow these steps:

1. **Push to GitHub**:
   - Initialize a Git repository here and push this entire folder to your GitHub account as a new public or private repository.

2. **Create a Railway Account**:
   - Go to [Railway.app](https://railway.app/) and sign up using your GitHub account.

3. **Provision PostgreSQL on Railway**:
   - In the Railway Dashboard, click **New Project** -> **Provision PostgreSQL**.
   - Wait a few seconds for the database to be ready.

4. **Deploy the Code**:
   - Click **Create** (or **+ New** button) in the same project -> **GitHub Repo** -> Select your pushed repository.
   - Railway will automatically detect the `package.json` and `railway.json` and start building the app.

5. **Connect Database to App**:
   - Go to your App Service settings in Railway.
   - Go to the **Variables** tab.
   - Add a new variable `DATABASE_URL` and set its value to `${{Postgres.DATABASE_URL}}` (Railway's autocomplete will suggest this).
   - Add `JWT_SECRET` with any random secure string.
   - Add `PORT` as `5000`.

6. **Migrate Production Database**:
   - Add a `postinstall` script in the root `package.json` or run the Prisma push manually.
   - To do it automatically, update the root `package.json` build script to:
     `"build": "npm install --prefix server && npm install --prefix client && npx prisma generate --schema=./server/prisma/schema.prisma && npx prisma db push --schema=./server/prisma/schema.prisma && npm run build --prefix client"`
   
7. **View Live App**:
   - Go to the **Settings** tab of your App Service in Railway, click **Generate Domain**, and click the link!

---

## 📦 Submission Details

- **Live URL**: (Paste your Railway URL here after deploying)
- **GitHub Repo**: (Paste your GitHub URL here)
- **Video Demo**: (Record a 2-5 min Loom or local screen recording demonstrating Login, Admin Project Creation, Member Task update, and Dashboard)
