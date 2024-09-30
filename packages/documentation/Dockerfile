# Use the official Node.js 20 image as the base image
FROM node:20-alpine

# Install Yarn (Uncomment the next line if Yarn is not included in the Node image)
RUN apk add --no-cache yarn

# Set the working directory to /app
WORKDIR /app

# Copy the package.json, yarn.lock, and tsconfig.json files to the container
# Note: Make sure you have a yarn.lock file, if not, generate it by running 'yarn install' on your local machine
COPY package.json yarn.lock tsconfig.json ./

# Install the dependencies
RUN yarn install --frozen-lockfile && yarn cache clean

# Copy the rest of the application code to the container
COPY . .

# Expose port 8083
EXPOSE 8084

# Build the React application
RUN yarn build

# Set the command to start the React application
CMD ["yarn", "serve", "--", "--port", "8084", "--host", "0.0.0.0"]]
