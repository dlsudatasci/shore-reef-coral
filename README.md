This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

The backend is built with [Prisma](https://www.prisma.io/) with a MySQL flavor.

## Prerequisites
- [NodeJS](https://nodejs.org/en/)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)
- [yarn](https://yarnpkg.com/getting-started/install)

## Getting Started

1.) Install all dependencies:

```bash
npm install
# or
yarn install
```

2.) Get the .env file from the ALTDSI discord channel in the pinned messages

3.) Replace the username and password of your MySQL server to the DB_URL variable in the .env file

- Format: DB_URL=mysql://[username]:[password]@localhost:3306/shore
- Example: DB_URL=mysql://root:1234@localhost:3306/shore

4.) Run all the database migrations to build the backend:

```bash
npm run migrate:dev
# or
yarn migrate:dev
```

5.) Lastly, run the development server:

```bash
npm run dev
# or
yarn dev
```

## Making changes to the backend
- Update schema.prisma file
- npx prisma generate
- npx prisma migrate dev --name <migration-name>
- npm run migrate:dev

When making changes to [schema.prisma](./prisma/schema.prisma), make sure to run migrations again for changes to take effect in the database and the frontend client library.
