
## IN Recording

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


 Open Swagger and show the available auth and task APIs.
 Go to the frontend register page and create a test account.
 Show that login redirects to the protected dashboard.
 Create a task with title, description, status, and priority.
 Edit the task and save changes.
 Delete the task.
 Open Postman and run one protected task request with the Bearer token.
 End by showing the scalability note file.

```text
This is TaskFlow RBAC, a task management API built with Node.js, Express, TypeScript, MongoDB, JWT authentication, and role-based access control.

The backend is organized into routes, controllers, services, repositories, models, validators, and middlewares. Users can manage their own tasks, while admins can access all tasks.

The frontend is a simple React UI used to test registration, login, protected routes, and task CRUD operations.
```

