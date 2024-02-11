#!/bin/bash
# Runs migration for dev on startup.
npx prisma migrate dev

# Runs the application in watch mode.
npm run start:dev
# Runs the application in dev mode.
npm run start