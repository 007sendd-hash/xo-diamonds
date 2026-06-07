FROM node:22-slim

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source
COPY . .

# Expose Astro dev server port
EXPOSE 4321

# Start dev server with hot reload
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
