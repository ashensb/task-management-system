# Task Management System (Full-Stack Web Application)

A full-stack, responsive Task Management System built with Node.js/Express, React, MySQL, and Tailwind CSS. The application allows users to securely authenticate, manage tasks with priority levels and statuses, filter/search/sort tasks, and view dynamic dashboard analytics.

---

## Features

- **User Authentication:** Secure JWT-based Login/Logout authentication.
- **Task Management (CRUD):** Create, Read, Update, and Delete tasks.
- **Dashboard Analytics:** Live statistics for Total, Pending, In Progress, Completed, and Overdue tasks.
- **Search & Filtering:** Search by task title/description, filter by Priority (Low, Medium, High) and Status (Pending, In Progress, Completed), and sort by Creation Date or Due Date.
- **Interactive UI/UX:** Built with Tailwind CSS, Lucide React icons, interactive Modal dialogs, Loading Spinners, and Toast Notifications (`react-hot-toast`).
- **Containerization:** Fully dockerized setup using Docker & Docker Compose.

---

##  Technology Stack

- **Frontend:** React (Vite), Tailwind CSS, Axios, Lucide React, React Hot Toast
- **Backend:** Node.js, Express.js, JSON Web Token (JWT), bcryptjs, CORS, dotenv
- **Database:** MySQL 8.0 (`mysql2` package with Connection Pooling)
- **Containerization:** Docker, Docker Compose

---

## Project Structure

```text
task-management-system/
├── backend/
│   ├── config/
│   │   └── db.js            # MySQL connection pool
│   ├── controllers/
│   │   ├── authController.js # Login logic & JWT issue
│   │   └── taskController.js # Task CRUD & Dashboard stats logic
│   ├── middleware/
│   │   └── authMiddleware.js # JWT protection middleware
│   ├── routes/
│   │   ├── authRoutes.js    # Auth endpoints
│   │   └── taskRoutes.js    # Task endpoints
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── server.js            # Express entry point
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, TaskModal, etc.
│   │   ├── pages/           # Login, Dashboard
│   │   ├── services/        # Axios API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
├── database/
│   └── schema.sql           # Database schema & sample seed data
├── docker-compose.yml
└── README.md
```

---

## Environment Variables

### Backend (`backend/.env`)

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=********
DB_NAME=task_management_db
JWT_SECRET=super_secret_jwt_key_12345
```

### Frontend (`frontend/.env`)

Create a `.env` file inside the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Database Setup

1. Open your MySQL client (e.g., MySQL Workbench, phpMyAdmin, or Command Line).
2. Execute the SQL script located in `database/schema.sql` to create the database, tables, and sample data.

```sql
CREATE DATABASE IF NOT EXISTS task_management_db;
USE task_management_db;

-- Executing schema.sql creates:
-- 1. `users` table
-- 2. `tasks` table with foreign key constraint
-- 3. Pre-seeded demo admin user (admin@test.com / 123456) and sample tasks
```

---

## Installation & Running Instructions

### Option 1: Running with Docker (Recommended)

Make sure Docker Desktop is installed and running, then execute:

```bash
docker-compose up --build
```

- **Frontend App:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

---

### Option 2: Manual Local Setup

#### 1. Setup Backend

```bash
cd backend
npm install
npm start
```
*Backend server runs on `http://localhost:5000`*

#### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```
*Frontend app runs on `http://localhost:5173`*

---

##  Demo Credentials

- **Email:** `admin@test.com`
- **Password:** `123456`

---

## API Documentation

### Auth Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | No |

#### `POST /api/auth/login` Request Body:
```json
{
  "email": "admin@test.com",
  "password": "123456"
}
```

---

### Task Routes (`/api/tasks`) *(Header: `Authorization: Bearer <TOKEN>`)*

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Fetch all tasks (Supports `search`, `status`, `priority`, `sortBy`) | Yes |
| `GET` | `/api/tasks/dashboard/stats` | Fetch summary statistics for the dashboard | Yes |
| `POST` | `/api/tasks` | Create a new task | Yes |
| `PUT` | `/api/tasks/:id` | Update an existing task | Yes |
| `DELETE` | `/api/tasks/:id` | Delete a task | Yes |

#### `POST /api/tasks` Request Body:
```json
{
  "title": "Setup Docker Environment",
  "description": "Configure docker-compose for Node.js and MySQL",
  "status": "In Progress",
  "priority": "High",
  "due_date": "2026-08-01"
}
```

---

## Assumptions Made

1. Single organization/admin scope for task management with JWT-secured access.
2. MySQL database password hashing uses `bcryptjs` with 10 salt rounds for secure password verification.
3. Overdue task detection evaluates tasks where `due_date < CURRENT_DATE()` and `status != 'Completed'`.

---

##  Known Limitations

1. User registration endpoint is restricted to administrative initialization via seed scripts.
2. File attachments/uploads for tasks are not supported in the current version.