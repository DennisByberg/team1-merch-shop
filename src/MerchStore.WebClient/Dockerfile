# FROM node:20-alpine AS build
# WORKDIR /app

# # Copy package.json and package-lock.json (or yarn.lock) first for better caching
# # Paths are relative to the build context (repo root)
# COPY src/MerchStore.WebClient/package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the WebClient source code
# # Paths are relative to the build context (repo root)
# COPY src/MerchStore.WebClient/. ./

# # Declare build arguments received from the CI/CD pipeline
# ARG VITE_API_URL
# ARG VITE_API_KEY
# ARG VITE_REVIEW_API_URL
# ARG VITE_REVIEW_API_KEY
# ARG VITE_CLIENT_ID
# ARG VITE_CLIENT_SECRET
# ARG VITE_JIN_API_URL
# ARG VITE_JIN_API_KEY

# # Set environment variables that Vite will use during the build process
# ENV VITE_API_URL=${VITE_API_URL}
# ENV VITE_API_KEY=${VITE_API_KEY}
# ENV VITE_REVIEW_API_URL=${VITE_REVIEW_API_URL}
# ENV VITE_REVIEW_API_KEY=${VITE_REVIEW_API_KEY}
# ENV VITE_CLIENT_ID=${VITE_CLIENT_ID}
# ENV VITE_CLIENT_SECRET=${VITE_CLIENT_SECRET}
# ENV VITE_JIN_API_URL=${VITE_JIN_API_URL}
# ENV VITE_JIN_API_KEY=${VITE_JIN_API_KEY}

# # Build the application
# RUN npm run build

# # Stage 2: Serve the application with Nginx
# FROM nginx:alpine

# # Copy the default Nginx configuration file
# COPY src/MerchStore.WebClient/nginx.conf /etc/nginx/conf.d/default.conf

# # Copy the built static files from the build stage
# COPY --from=build /app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

#NEW SOLUTION?
FROM node:20-alpine
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY src/MerchStore.WebClient/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the WebClient source code
COPY src/MerchStore.WebClient/. ./

# Declare build arguments received from the CI/CD pipeline
ARG VITE_API_URL
ARG VITE_API_KEY
ARG VITE_REVIEW_API_URL
ARG VITE_REVIEW_API_KEY
ARG VITE_CLIENT_ID
ARG VITE_CLIENT_SECRET
ARG VITE_JIN_API_URL
ARG VITE_JIN_API_KEY

# Set environment variables that Vite will use during the build process
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_API_KEY=${VITE_API_KEY}
ENV VITE_REVIEW_API_URL=${VITE_REVIEW_API_URL}
ENV VITE_REVIEW_API_KEY=${VITE_REVIEW_API_KEY}
ENV VITE_CLIENT_ID=${VITE_CLIENT_ID}
ENV VITE_CLIENT_SECRET=${VITE_CLIENT_SECRET}
ENV VITE_JIN_API_URL=${VITE_JIN_API_URL}
ENV VITE_JIN_API_KEY=${VITE_JIN_API_KEY}

# Build the application
RUN npm run build

# Expose port 8080 (not 80)
EXPOSE 8080

# Start Vite preview server with proxy support
CMD ["npm", "run", "start"]