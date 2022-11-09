This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

The backend is built with [Prisma](https://www.prisma.io/) with a MySQL flavor.

## Prerequisites
- [NodeJS](https://nodejs.org/en/)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)

## Getting Started

First, install all dependencies:

```bash
npm install
# or
yarn install
```

Second, run all the database migrations to build the backend:

```bash
npm run migrate
# or
yarn migrate
```

Lastly, run the development server:

```bash
npm run dev
# or
yarn dev
```

## Making changes to the backend

When making changes to [schema.prisma](./prisma/schema.prisma), make sure to run migrations again for changes to take effect in the database and the frontend client library.
