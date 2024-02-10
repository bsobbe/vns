# VNS

Original requirements `./Requirements.md`

## Installation Guide

Clone the project.

```sh
git clone git@github.com:bsobbe/vns.git
```

1. Open `vns/` directory.

2. Copy `.env.example` file to `.env`. The latest env variables will be added to `.env.example`. So do not delete or rename this file. Then open the copied file and add your environment variables:

```env
# DB Credentials
DB_USER=postgres
DB_PASSWORD=docker
DB_HOST=db
DB_PORT=5432
DB_DATABASE=recruitment
DB_SCHEMA=task
# Database URLs
DATABASE_URL="postgresql://postgres:docker@db:5432/recruitment?schema=task&sslmode=prefer"
SHADOW_DATABASE_URL="postgresql://postgres:docker@db:5432/recruitment?schema=dbmigration&sslmode=prefer"
# Configs
APP_PORT=8080
NODE_ENV=dev
JWT_SECRET="SeriouslyPleaseDoNotUseThisAsTheRealSecretInsteadPickSomethingReallyComplexThatConfusesBots!"
```

## Todo

- [x] CRUD operations for customers (get, update, delete) by id or email.
- [x] Login and Signup operations for customers.
- [x] Roles USER and ADMIN.
- [x] Access token.
- [x] Refresh token.
- [x] Restrict access to get customers operation from unauthenticated users.
- [x] Restrict access to delete customer and update customer operations from unauthenticated users and customers with USER role.
- [x] Ability to verify customer's account after signup with activation code.
- [ ] More test coverage.
- [ ] Server-side logout functionality.
- [ ] Secure key rotation mechanism for refresh tokens.
- [ ] Handling expiration for activation codes.
- [ ] Separation of admins and customers (eg. Abstracting User)?
- [ ] Separation of activation codes from customer?
- [ ] Multiple destination streams for logs?