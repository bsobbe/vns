#!/bin/bash
chmod +x ./waitforit.sh
./waitforit.sh db:5432 -t 100 -- npx prisma migrate dev && npm run start:dev