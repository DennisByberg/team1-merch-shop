# FROM node:20-alpine AS build
# WORKDIR /app

# COPY ../../src/MerchStore.WebClient/ ./
# RUN npm install && npm run build

# FROM nginx:alpine
# COPY --from=build /app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

FROM node:20-alpine AS build
WORKDIR /app

# Kopiera package.json och package-lock.json (eller yarn.lock) först för bättre cachning
# Sökvägar är relativa till byggkontexten (repo-roten)
COPY src/MerchStore.WebClient/package*.json ./

# Installera beroenden
RUN npm install

# Kopiera resten av WebClient källkoden
# Sökvägar är relativa till byggkontexten (repo-roten)
COPY src/MerchStore.WebClient/. ./

# Deklarera byggargument som tas emot från CI/CD-pipelinen
ARG VITE_API_URL
ARG VITE_API_KEY

# Ställ in miljövariabler som Vite kommer att använda under byggprocessen
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_API_KEY=${VITE_API_KEY}

# Bygg applikationen
RUN npm run build

# Stage 2: Servera applikationen med Nginx
FROM nginx:alpine
# Kopiera de byggda statiska filerna från build-stadiet
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]