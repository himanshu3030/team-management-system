# Team Control System

A role-based team management app built with Next.js, TypeScript, Prisma, PostgreSQL, and Tailwind CSS.

## Features

- Email/password authentication with registration, login, and logout
- Role-based access control for `ADMIN`, `MANAGER`, `USER`, and `GUEST`
- Team assignment and team-based user relationships
- Protected dashboard views for admins, managers, and regular users
- API routes for user management, team assignment, and role updates
- Password hashing with `bcryptjs` and JWT session handling with `jsonwebtoken`
- Authentication state stored in HTTP-only cookies for secure sessions

## Technology Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Prisma ORM
- PostgreSQL (via Prisma datasource)
- Tailwind CSS
- bcryptjs
- jsonwebtoken
- ESLint

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.


## Notes

This README was updated to reflect the custom feature set and technologies used in the Team Control System application.
