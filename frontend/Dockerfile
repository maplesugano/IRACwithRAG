# Use a lightweight Node.js base image
FROM node:23-alpine AS build

WORKDIR /app

# Install dependencies
COPY frontend/package.json frontend/package-lock.json /app/
COPY frontend/default.conf /etc/nginx/conf.d/default.conf

RUN npm install

# Build the React app
COPY frontend/. ./
RUN npm run build

# Serve using Nginx
FROM nginx:alpine

# Install gettext (needed for envsubst)
RUN apk add --no-cache gettext

# Copy built React app
COPY --from=build /app/build /usr/share/nginx/html

# Copy Nginx config template
COPY frontend/default.conf /etc/nginx/conf.d/default.template

# Ensure PORT substitution before running Nginx
CMD ["sh", "-c", "envsubst '$$PORT' < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
