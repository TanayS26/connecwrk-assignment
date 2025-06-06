ConnecWrk Backend Assignment
This repository contains the backend API solution for the ConnecWrk professional platform, developed as part of a backend assignment. The platform supports user authentication with different roles, a job board for recruiters and candidates, and a freelance gig marketplace.

🚀 Technologies Used
Node.js: JavaScript runtime environment.

Express.js: Fast, unopinionated, minimalist web framework for Node.js.

MongoDB: NoSQL database for storing application data.

Mongoose: MongoDB object modeling tool for Node.js.

JSON Web Tokens (JWT): For secure authentication and authorization.

Bcrypt.js: For hashing user passwords securely.

Dotenv: For managing environment variables.

✨ Features Implemented
The backend APIs are structured into modules, covering the core functionalities as outlined in the assignment:

Module 1: Authentication & User Roles
User Registration: Allows users to register with name, email, password, and role (Candidate, Recruiter, Freelancer).

User Login: JWT-based authentication for user login.

Role-based Access Control: Middleware to enforce access restrictions based on user roles.

Secure Passwords: Passwords are hashed using bcrypt before storage.

Module 2: Job Board (for Recruiters & Candidates)
Job Management (Recruiters):

Create, Update, Delete job listings.

Fields include title, description, skills, salaryRange, location, jobType, and recruiterId.

Job Listing (Candidates/Recruiters):

View a list of jobs with pagination and filtering options (by location, job type, skills, title, description).

Job Application (Candidates):

Apply to jobs by storing candidateId, jobId, and resumeURL.

View a list of jobs they have applied to.

Module 3: Freelance Gigs (for Freelancers & Others)
Gig Management (Freelancers):

Create, Update, Delete gig listings.

Fields include title, description, tags, price, deliveryDays, and freelancerId.

Gig Listings (Recruiters/Candidates):

View gig listings with pagination and filtering options (by title, description, tags, price, delivery days).

Gig Order Placement (Recruiters/Candidates):

Place an order for a gig, storing gigId, buyerId, and status.

Module 4: Admin (Optional, if implemented)
User Management: Admin can view all users (with role filters).

Content Moderation: Admin can delete any job or gig listing.

General Features
JWT Authentication Middleware: Securely handles user authentication.

Modular Folder Structure: Organized controllers, models, routes, middleware, and config directories for maintainability.

Error Handling & Validations: Robust error handling and input validation for API requests.

Pagination: Implemented for all listing endpoints (jobs, gigs, applied jobs).

.env for Configuration: Environment variables for sensitive data like MongoDB URI and JWT secret.

⚙️ Setup Instructions
Follow these steps to get the project up and running on your local machine.

Prerequisites
Node.js (v14 or higher recommended)

MongoDB (local instance or cloud service like MongoDB Atlas)

NPM (Node Package Manager)

1. Clone the Repository
   git clone https://github.com/TanayS26/connecwrk-assignment.git
   cd connecwrk-assignment

2. Install Dependencies
   npm install

3. Environment Variables
   Create a .env file in the root directory of your project and add the following environment variables:

PORT=8000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key

Replace <username>, <password>, <cluster-url>, and <database-name> with your MongoDB connection details.

JWT_SECRET: Choose a strong, random string for your JWT secret.

4. Run the Application
   Development Mode (with nodemon)
   npm start

This will start the server using nodemon, which automatically restarts the server on file changes.
