Movie Rating API

Description:
This project consists of multiple services running as microservices, with each service handling different aspects of the application. It includes the main service and Service A, both of which must be set up and run separately. Below are the instructions on how to get the project running on your local machine.

Prerequisites:
Before running the project, make sure you have the following installed:
- Node.js (v12 or higher)
- npm (comes with Node.js)
- NestJS CLI (optional, for easier development)

Installing NestJS CLI:
To install NestJS CLI globally, you can run the following command:
    npm install -g @nestjs/cli

Installation Steps:
1. Clone the repository
First, clone the repository to your local machine:
    git clone https://github.com/yourusername/movie-rating-api.git
    cd movie-rating-api

2. Main Service
- Open a terminal and navigate to the main-service folder:
    cd main-service
- Install the dependencies for the Main Service:
    npm install
- Start the Main Service in development mode:
    npm run start:dev
- Once the service is running, you should see:
    Application is running on: http://localhost:3000/api
    Swagger UI is available at: http://localhost:3000/api
    The Main Service will be available at http://localhost:3000/api.

3. Service A
- Open another terminal and navigate to the service-a folder:
    cd service-a
- Install the dependencies for Service A:
    npm install
- Start Service A in development mode:
    npm run start:dev
- Once the service is running, you should see:
    Service A microservice is running on port 3001
    Service A HTTP is running on: http://localhost:4001
    Service A will be accessible at http://localhost:4001.

API Endpoints:
- Main Service:
    Base URL: http://localhost:3000/api
    Swagger UI: http://localhost:3000/api
- Service A:
    Base URL: http://localhost:4001

Environment Variables:

For **Main Service**, the following environment variables are required:
- MONGO_URI: MongoDB connection URI (e.g., mongodb+srv://your-cluster-url)
- EXPIRE_TIME: Expiry time for JWT tokens (default: 1d)
- CLOUDINARY_CLOUD_NAME: Cloudinary cloud name for file uploads
- CLOUDINARY_API_KEY: Cloudinary API key
- CLOUDINARY_API_SECRET: Cloudinary API secret

For **Service A**, the following environment variable is required:
- MONGO_URI: MongoDB connection URI (e.g., mongodb+srv://your-cluster-url)

Make sure to create a .env file in the root of the project for all necessary environment variables.

Example of `.env` file for **Main Service**:
    MONGO_URI=mongodb+srv://your-cluster-url
    EXPIRE_TIME=1d
    CLOUDINARY_CLOUD_NAME=your-cloud-name
    CLOUDINARY_API_KEY=your-api-key
    CLOUDINARY_API_SECRET=your-api-secret

Example of `.env` file for **Service A**:
    MONGO_URI=mongodb+srv://your-cluster-url


Troubleshooting:
- If you face issues while starting the services:
    - Ensure you have run npm install in both the main-service and service-a directories.
    - Make sure there are no conflicts with the port numbers (3000, 3001, 4001).
    - Check for any error messages in the terminal for additional information.
    - If the application fails to connect to the database, verify that the correct DATABASE_URL is set.
- If the Swagger UI is not loading, ensure that the Main Service is running correctly at http://localhost:3000.

Conclusion:
This file provides the necessary steps to set up and run the Movie Rating API project locally using NestJS. If you encounter any issues or need further assistance, feel free to reach out or check the NestJS documentation (https://docs.nestjs.com/) for more details.
