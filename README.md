# Notes App: Your Personal Note-Taking Solution

Introducing Notes App, a modern, full-stack note-taking web application that seamlessly integrates a React frontend with a robust backend API. It has been specifically designed to offer an intuitive, responsive user experience combined with a secure, high-performance back-end.

**Features:**

- **Frontend**: Built using the React.js framework, the user interface is both dynamic and interactive. It leverages components like StickyNote2Icon from the MUI library for visually pleasing elements and supports Google authentication for secure sign-ins.
  - Live Site: [https://notesapp.fuyuri.com/](https://notesapp.fuyuri.com/)
  - Repository: [React Frontend](https://github.com/Yurui-Feng/notes-app-frontend/)

- **Backend**: Developed to handle the core functionality of note storage, retrieval, and user authentication. It integrates seamlessly with the frontend, ensuring efficient data processing and transfer.

- **Deployment**: The application utilizes a multi-stage Docker build process for optimized deployment. With the combination of Node.js and NGINX, it ensures that the application is both lightweight and performant.

**Docker Deployment Highlights**:
- Uses the Node 18-alpine image for a lightweight and efficient build.
- Employs NGINX via the stable-alpine image, offering high performance and stability for serving the application.

## Backend for Notes App

This repository contains the backend for a notes application that allows users to create, retrieve, and delete notes. It uses Express for the web server, Mongoose for interacting with MongoDB, and Google OAuth2.0 for authentication.

### Features

- **Authentication**: Uses Google OAuth2.0 for user authentication.
- **CRUD Operations**: Users can create, retrieve, and delete their notes.
- **Health Check**: Includes an endpoint for load balancer health checking.

#### Local Development

##### Prerequisites

- Node.js
- MongoDB

##### Environment Variables

Create a `.env` file with the following variables:

- `PORT`: Port for the server (default 3000).
- `MONGODB_URI`: Connection string for MongoDB.
- `SECRET`: Secret key for Express sessions.
- `CLIENT_ID`: Google OAuth client ID.
- `CLIENT_SECRET`: Google OAuth client secret.
- `GOOGLE_CALLBACK_URL`: Callback URL for Google OAuth.
- `FRONTEND_URL`: URL for the frontend (default `http://localhost:3001`).

##### Running the Application

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Start MongoDB.
4. Run `npm start` to start the server.
5. The server will be running at `http://localhost:3000`.

#### API Endpoints

- **GET `/health`**: Health check.
- **GET `/auth/google`**: Start Google OAuth process.
- **GET `/auth/google/secrets`**: Callback for Google OAuth.
- **GET `/isAuthenticated`**: Check authentication status.
- **POST `/logout`**: Log out the current user.
- **GET `/notes`**: Retrieve all notes (must be authenticated).
- **POST `/notes`**: Create a new note (must be authenticated).
- **DELETE `/notes/:id`**: Delete a note (must be authenticated).

Certainly! Here's the revised Part 2 that takes into account the presence of the `Dockerfile` in the GitHub repository.

## Part 2: Deployment to AWS ECS

### Overview

The backend is containerized using Docker and deployed to AWS Elastic Container Service (ECS). A load balancer is used to distribute traffic. The `Dockerfile` used for building the Docker image is available in the GitHub repository.

#### Steps

1. **Dockerize the Application**:
   - Retrieve the `Dockerfile` from the GitHub repository.
   - Run `docker build -t your-image-name .` to build the image using the `Dockerfile`.
   - Run `docker push your-image-name` to push the image to a registry (e.g., Amazon ECR).

2. **Create an ECS Cluster**:
   - Navigate to the ECS console on AWS.
   - Create a new ECS cluster.
   - Define the task definition with the Docker image and necessary environment variables.
   - Create a new ECS service using the task definition.
   - Configure the load balancer with the ECS service.

3. **Set Up Security Groups and VPC**:
   - Configure security groups to allow necessary inbound and outbound traffic.
   - Connect the ECS service with the appropriate VPC and subnets.

4. **Monitoring and Logging**:
   - Consider setting up CloudWatch for monitoring and logging.

5. **Accessing the Application**:
   - The application can be accessed via the load balancer's DNS name.

#### Continuous Deployment

Continuous Deployment (CD) can be implemented later to automate the build and deployment process using services like AWS CodePipeline, GitHub Actions, or other CI/CD tools. This would involve automatically triggering a build process upon a commit to the GitHub repository, building the Docker image using the `Dockerfile`, and deploying the updated image to ECS.

Refer to the [AWS documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-cd-pipeline.html) for more information on setting up a CD pipeline with ECS.

### Conclusion

This README provides an overview of the application, instructions for local development, and steps for deploying the backend to AWS ECS, including information on the Dockerization process using the `Dockerfile` in the GitHub repository. Feel free to add or modify any sections as needed. I look forward to hearing from you soon!
