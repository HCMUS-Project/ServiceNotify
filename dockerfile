# Use a Node.js base image
FROM node:20

# Set the working directory in the container
WORKDIR /root/deploy/datn/ServiceNotify

# Copy package.json and package-lock.json
COPY . .

# Install dependencies
RUN yarn install

# Creates a "dist" folder with the production build
RUN yarn build

# Expose the port your app runs on
EXPOSE 3007

# Command to run your application
CMD ["yarn", "start"]