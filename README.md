# miratonmatadorgroup-assessment

# Node.js Banking System

# Project Overview
This project is a simple banking system built using Node.js. It includes features for user registration, account management, transaction processing, and user authentication. The system uses PostgreSQL for the database and JWT for user authentication.


# Table of Contents
Features
Technologies Used
Getting Started 
Testing
Documentation
Contact

# Features
User Authentication:
Register new users.
Password Validation: Making sure the Password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 8 characters long.
Login and obtain a JWT.
Retrieve authenticated user details.
Account Management:
Create new accounts for users.
Retrieve account details.
Transaction Processing:
Create transactions (debit/credit) for accounts.
List all transactions for a specific user.
Transfer money between accounts.
Bonus Features:
Send notifications on successful authentication.


# Technologies
Node.js: Runtime environment.
Nest.js: nest.js framework for building APIs.
PostgreSQL: Relational database.
TypeORM: ORM for interacting with the database.
JWT: JSON Web Tokens for authentication.
Nodemailer: For sending email notifications.

# Getting Started
To get started with the project, follow these steps:

Clone the repository: git clone [https://github.com/Erhimuebru/miratonmatadorgroup-assessment.git]
cd miratonmatadorgroup-assessment

Create a .env file add the following:

DATABASE_HOST=dpg-cqstrr5umphs73c3ra20-a.oregon-postgres.render.com
DATABASE_PORT=5432
DATABASE_USER=miratonmatadorgroup_assessment_user
DATABASE_PASSWORD=HtpIgzfsjqFzER0H2zTDYLOw37tmiyEm
DATABASE_NAME=miratonmatadorgroup_assessment
PORT = 5000
EMAIL_USER= "erhimuebru87@gmail.com"
EMAIL_PASSWORD= "ootsghibwvcuocbv"
JWT_SECRET = 'your_jwt_secret'
JWT_SECRET_TIME = 1h   .

Run npm i or yarn to install all dependencies.
Ensure your PostgreSQL database is running. Then run
yarn typeorm migration:run or npm run typeorm migration:run
Run npm run start:dev or yarn start:dev from your terminal to get the app started

# Testing
Postman Collection
A Postman collection is included in the repository to test the API endpoints. You can import the collection into Postman from the Postman folder in the repository.

# Documentation
GitHub Repository: [https://github.com/Erhimuebru/miratonmatadorgroup-assessment.git]
Postman Collection: Included in the Postman folder of the repository.


# Contact
If you have any questions or need further assistance, feel free to contact me:

Name: [Erhimu Ebru Blessing] 
Email: [Erhimuebru87@gmail.com] 
Mobile: [09018471745] 
Linkedin: [https://www.linkedin.com/in/erhimu-ebru-blessing-29aa4917b]