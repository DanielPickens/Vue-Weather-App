# Get a base Node image

FROM node:alpine

# Make the 'app' folder the current working directory
WORKDIR /Vue-Weather-App

# Copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .


# Install project dependencies
RUN npm install



# Build app for production with minification
RUN npm run build

# Runs the website on http://localhost:8080
CMD ["npm", "run", "serve"]