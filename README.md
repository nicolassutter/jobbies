A job application manager and tracker.

## Features

- User account (registration disabled) and demo acount open to the public (credentials displayed on the login page)
- Add and edit job applications
- Add a status, description and url to each application
- Get statistics based on your applications

## Stack

### Frontend

- React with the React compiler
- @tanstack/react-query and @tanstack/react-router
- TypeScript
- Tailwind CSS
- Vite
- Zod and tRPC
- shadcn/ui for the amazing components

### Backend

- Pocketbase for auth
- h3 and tRPC with zod for custom endpoints
- SQLite for the database

### Hosting

- The demo is hosted on my home server but it can run wherever with Docker
