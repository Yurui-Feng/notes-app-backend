# Use the specified Node.js version
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the port that the app runs on
EXPOSE 3000

# Command to run the application
# CMD ["npm", "start"]
