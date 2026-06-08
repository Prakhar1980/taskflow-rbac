# Demo Video Guide

Use this as a short script while recording the project demo.

## Suggested Length

Keep the video around 2 to 4 minutes. The goal is to prove that the backend works and the frontend is connected to it.

## Before Recording

Start the project:

```bash
docker compose up --build
```

Or run services manually:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

Open these tabs:

- Frontend: `http://localhost:5173`
- Swagger: `http://localhost:5000/api-docs`
- GitHub repository
- Postman collection

## Recording Flow

1. Start on the GitHub repository and show the README.
2. Open Swagger and show the available auth and task APIs.
3. Go to the frontend register page and create a test account.
4. Show that login redirects to the protected dashboard.
5. Create a task with title, description, status, and priority.
6. Edit the task and save changes.
7. Delete the task.
8. Open Postman and run one protected task request with the Bearer token.
9. End by showing the scalability note file.

## What To Say

Example:

```text
This is TaskFlow RBAC, a task management API built with Node.js, Express, TypeScript, MongoDB, JWT authentication, and role-based access control.

The backend is organized into routes, controllers, services, repositories, models, validators, and middlewares. Users can manage their own tasks, while admins can access all tasks.

The frontend is a simple React UI used to test registration, login, protected routes, and task CRUD operations.
```

## Adding The Video To README

After recording, upload the video to GitHub:

1. Open the repository on GitHub.
2. Edit `README.md`.
3. Drag and drop the video into the README editor.
4. GitHub will upload it and create a video link.
5. Replace this placeholder:

```md
https://github.com/user-attachments/assets/replace-with-your-demo-video-link
```

with the uploaded GitHub video link.
