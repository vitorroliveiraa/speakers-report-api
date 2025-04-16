#!/bin/sh
echo "Running migrations..."
npx knex migrate:latest --knexfile dist/src/database/knexfile.js

echo "Starting server..."
node dist/server.js
