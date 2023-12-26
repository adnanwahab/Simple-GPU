#Use an official Node runtime as a parent image
FROM node:14

#Set the working directory in the container
WORKDIR /usr/src/app

#Copy package.json and package-lock.json (or yarn.lock)
#COPY package.json ./

#COPY package.json /usr/src/app/

RUN ls -la

#Install project dependencies
RUN npm install

# Bundle app source inside the Docker image
COPY . .

# Build your app
RUN npm run build

# Your app runs on port 3000, so expose this port
EXPOSE 3000

# Define the command to run your app (adjust the start script according to your project)
CMD ["npm", "run", "dev"]