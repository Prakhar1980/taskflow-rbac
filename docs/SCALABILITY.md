# Scalability Notes

This project is small, but the backend is structured so it can grow without a full rewrite.

## Horizontal Scaling

The API uses JWT access tokens, so requests do not depend on in-memory server sessions. Multiple backend containers can run at the same time as long as they share the same MongoDB database, Redis cache, and JWT secrets.

## Load Balancing

In production, a reverse proxy or cloud load balancer can sit in front of the backend containers. Health checks should point to `GET /api/v1/health`. Sticky sessions are not required because authentication is token-based.

## Redis Caching

Redis is used for short-lived task list caching. It is most useful for repeated dashboard queries such as admin task views or filtered lists. Cache invalidation happens after task create, update, and delete operations.

## Database Indexing

The task model indexes `createdBy`, `status`, `priority`, and text search fields. These indexes support common queries:

- user-specific task lists
- admin filters by status or priority
- title and description search

For larger datasets, query patterns should be reviewed with MongoDB explain plans before adding more indexes.

## Microservice Migration Strategy

The first split would likely be authentication and task management:

- Auth service: users, login, refresh tokens, role management
- Task service: task CRUD, ownership checks, filtering

Before splitting, I would add automated tests, API contracts, centralized logging, and tracing. Moving to microservices too early would add deployment and debugging overhead without much benefit for this project size.
