# Employee Onboarding System

A modern fullstack onboarding platform built with React, TypeScript, Node.js, Express and PostgreSQL.

This project started as a modernization of an existing onboarding application and is continuously being expanded as a personal learning and portfolio project focused on modern frontend and backend development.

---

## Features

### Authentication

* User login system
* Role-based access (`admin` / `employee`)
* Password hashing with bcrypt

### Task Management

* Personalized onboarding tasks
* Progress tracking
* Task status updates
* Automatic task assignment based on department

### Admin Panel

* Create new users
* Create onboarding tasks
* Assign tasks manually
* User search functionality

### Frontend

* Modern React + TypeScript architecture
* Responsive UI
* Component-based structure
* API abstraction layer
* Accessible design principles

### Backend

* REST API with Express
* PostgreSQL database integration
* Modular route structure
* SQL-based task assignment logic

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* shadcn/ui

### Backend

* Node.js
* Express
* PostgreSQL
* bcrypt
* CORS

### Tooling

* Git
* GitHub
* npm
* concurrently

---

## Project Structure

```text
employee-onboarding-system/
│
├── backend/
│   ├── routes/
│   ├── db/
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── routes/
│   └── lib/
│
└── package.json
```

---

## Getting Started

### Clone repository

```bash
git clone https://github.com/ThomasTheGrey/employee-onboarding-system.git
```

### Install dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

### Start development servers

From the project root:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

Backend runs on:

```text
http://localhost:3000
```

---

## Environment Variables

Frontend `.env`

```env
VITE_API_URL=http://localhost:3000
```

---

## Current Status

The application is fully functional in local development and currently supports:

* Login
* Task management
* Admin task assignment
* Progress tracking
* PostgreSQL integration

This repository is actively being expanded to improve:

* authentication
* UI/UX
* architecture
* TypeScript knowledge
* testing
* deployment workflows

---

## Planned Features

* JWT authentication
* Persistent sessions
* React Router
* Advanced filtering/search
* Dashboard analytics
* Notifications
* File uploads
* Docker support
* CI/CD pipelines
* Automated testing

---

## Learning Goals

This project is being used to deepen practical knowledge in:

* React
* TypeScript
* REST APIs
* Fullstack architecture
* PostgreSQL
* Git/GitHub workflows
* Modern frontend tooling

---

## Author

Thomas Schmidt

GitHub:
https://github.com/ThomasTheGrey
