# Scalable REST API with Authentication and RBAC

This is my internship assignment project for building a small task management system with authentication, role-based access control, and a React dashboard. The project is intentionally split into a backend API and a frontend client so both parts can be reviewed and deployed separately.

## Project Overview

The app solves a common problem in internal tools: users need to manage their own work, while admins need a wider view of the system. A normal user can create, update, search, and delete only their own tasks. An admin can view all tasks and access admin-only APIs.

The backend handles authentication, authorization, validation, task ownership checks, logging, caching, and API documentation. The frontend gives a simple interface for registration, login, and task CRUD operations.

## Demo Video

Project walkthrough video:

[Watch Demo Video](https://www.loom.com/share/e09174aa1e9449c5853dc35a3359a53c)

## Tech Stack

Backend:

- Node.js, Express.js, TypeScript
- MongoDB with Mongoose
- JWT access tokens and refresh tokens
- bcrypt password hashing
- Express Validator
- Swagger UI
- Helmet, CORS, Morgan, rate limiting
- Winston logging
- Optional Redis caching

Frontend:

- React.js with Vite
- Axios
- React Router DOM
- Context API
- React Toastify

## Architecture Overview

The backend follows a controller-service-repository structure:

- `controllers` handle HTTP requests and responses.
- `services` contain business rules such as login, refresh token rotation, task ownership, and cache invalidation.
- `repositories` isolate database queries.
- `middlewares` handle authentication, authorization, validation, security, and errors.
- `models` define MongoDB schemas.
- `validators` keep request validation close to the route layer.
- `docs` contains Swagger annotations.

This is a practical structure for a project of this size. It avoids putting everything into route files, but it also avoids unnecessary patterns that would make the assignment harder to read.

## Folder Structure

```text
.
|-- backend
|   |-- Dockerfile
|   |-- .env.example
|   |-- package.json
|   |-- tsconfig.json
|   `-- src
|       |-- app.ts
|       |-- server.ts
|       |-- config
|       |-- controllers
|       |-- docs
|       |-- middlewares
|       |-- models
|       |-- repositories
|       |-- routes
|       |-- services
|       |-- types
|       |-- utils
|       `-- validators
|-- frontend
|   |-- Dockerfile
|   |-- .env.example
|   |-- index.html
|   |-- package.json
|   |-- tsconfig.json
|   `-- src
|       |-- api
|       |-- components
|       |-- context
|       |-- pages
|       |-- routes
|       `-- styles
|-- docs
|   `-- SCALABILITY.md
|-- docker-compose.yml
|-- postman_collection.json
`-- README.md
```

## Design Decisions

JWT was used because the API is stateless and easy to run behind multiple server instances. Access tokens are short-lived, while refresh tokens allow the frontend to keep the user signed in without asking for credentials repeatedly.

RBAC was implemented in middleware because permissions should be enforced before the request reaches the controller. This keeps admin-only routes easy to read and reduces duplicated role checks.

Validation is done at the route boundary with Express Validator. Invalid data is rejected before it reaches services or database code, which keeps the rest of the application simpler.

The modular backend structure was chosen because it is easy to test and extend. For example, replacing MongoDB queries or adding more task rules would mostly affect the repository or service layer, not the route definitions.

## API Flow

1. A user registers or logs in through `/api/v1/auth`.
2. The API hashes passwords with bcrypt and returns an access token plus a refresh token.
3. The frontend stores the tokens and sends the access token in the `Authorization` header.
4. Protected routes pass through authentication middleware.
5. Admin routes also pass through role middleware.
6. Task APIs apply ownership rules in the service layer:
   - users only see their own tasks
   - admins can see all tasks
7. Validation and error middleware return consistent responses for bad requests and failures.

## Installation

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Docker

```bash
docker compose up --build
```

Local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Swagger docs: `http://localhost:5000/api-docs`
- MongoDB: `mongodb://localhost:27017/rbac_tasks`
- Redis: `redis://localhost:6379`

## Environment Variables

Backend:
```env
```
Frontend:
```env
```

## API Endpoints

Base URL: `/api/v1`

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/health` | No | Server health check |
| POST | `/auth/register` | No | Create account |
| POST | `/auth/login` | No | Login |
| POST | `/auth/refresh` | No | Refresh access token |
| POST | `/auth/logout` | Yes | Logout current user |
| GET | `/auth/me` | Yes | Get current user |
| POST | `/tasks` | Yes | Create task |
| GET | `/tasks?page=1&limit=10&search=&status=&priority=` | Yes | List tasks |
| GET | `/tasks/:id` | Yes | Get one task |
| PUT | `/tasks/:id` | Yes | Update task |
| DELETE | `/tasks/:id` | Yes | Delete task |
| GET | `/admin/users` | Admin | List users |

Health check response:

```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2026-06-08T10:30:00.000Z"
}
```

## Challenges Faced

- Keeping refresh token handling simple while still rotating tokens after refresh.
- Making task ownership checks consistent for read, update, and delete operations.
- Separating the project into useful backend layers without making it feel too heavy for an assignment.
- Keeping validation messages helpful instead of returning raw database or schema errors.
- Making Docker setup work with MongoDB and Redis while still allowing normal local development.

## Security Notes

- Passwords are hashed with bcrypt before saving.
- JWT secrets are read from environment variables.
- Helmet adds common HTTP security headers.
- Rate limiting is enabled globally.
- MongoDB operator injection is reduced with request sanitization.
- Admin routes are protected by both authentication and role middleware.
- Users cannot access tasks they did not create unless they are admins.

## Scalability Notes

A concise scaling plan is available in [docs/SCALABILITY.md](docs/SCALABILITY.md).

## Recommended Screenshots

For submission, I would include:

- Register Page
- Login Page
- Dashboard
- Task Creation
- Swagger Documentation
- Postman API Test

## Future Improvements

- Add automated unit and integration tests.
- Store refresh tokens as hashed values.
- Add forgot password and email verification.
- Add audit logs for admin actions.
- Add cursor-based pagination for very large task lists.
- Add CI workflow for linting, tests, and Docker build checks.
- Add stricter role management so users cannot self-register as admins in production.

## Deployment Steps

1. Create production MongoDB and Redis instances.
2. Set strong JWT secrets in the hosting environment.
3. Configure `CLIENT_URL` to match the deployed frontend domain.
4. Build and run the backend with `npm run build` and `npm start`.
5. Build the frontend with `npm run build` and serve the `dist` folder.
6. Put the API behind HTTPS and a reverse proxy.
7. Enable log retention, backups, and basic monitoring.

## Author

Built by Prakhar as an internship assignment project.
