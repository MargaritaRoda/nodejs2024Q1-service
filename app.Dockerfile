
FROM node:20.11.1-alpine3.19

WORKDIR /app
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm install

# Run vulnerability scanning
#RUN npm audit --audit-level=high  и добавь в package.json "vulnerability-scan": "npm audit"

COPY . .

CMD ["npm", "run", "start:dev"]

EXPOSE 4000





## Use a slim base image
#FROM node:20.11.1-alpine3.19
#
## Set the working directory inside the container
#WORKDIR /app
#
## Copy package.json and package-lock.json to container
#COPY package.json package-lock.json ./
#
## Install dependencies and clean up
#RUN npm install && \
#    npm cache clean --force
#
## Copy the rest of the application code
#COPY . .
#
## Specify the command to start the application
#CMD ["npm", "run", "start:dev"]
#
## Expose the port on which the application listens
#EXPOSE 4000
