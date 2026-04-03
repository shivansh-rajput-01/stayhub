# StayHub - Full Stack Vacation Rental App

A functional Airbnb clone built to practice the MERN stack, specifically focusing on Node, Express, and MongoDB. This project implements full CRUD operations, RESTful routing, and database seeding.

## Tech Stack
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose ODM)
- Templating: EJS (Embedded JavaScript)
- Middleware: Method-Override, Express-URL-Encoded, Dotenv

## Key Features
- Listing Management: Users can view all listings, see specific details, add new properties, edit existing ones, and delete them.
- RESTful API: Structured routing for all resources.
- Data Persistence: Integrated with MongoDB for storing listing details like title, price, location, and images.
- Smart Formatting: Indian Currency (INR) formatting for prices using .toLocaleString('en-IN').

## Project Structure
- app.js: Entry point of the application.
- models/: Database schemas (Listing model).
- init/: Data initialization scripts and sample data for testing.
- views/: EJS templates for the frontend.
- .env: Environment variables for sensitive data (Database URLs).

## Getting Started

1. Clone the repo:
git clone https://github.com/shivansh-rajput-01/stayhub.git

2. Install dependencies:
npm install

3. Setup Environment Variables:
Create a .env file in the root directory and add:
MONGO_URL=mongodb://127.0.0.1:27017/stayhub

4. Seed the Database:
Populate your local MongoDB with sample data:
node init/index.js

5. Start the Server:
node app.js

6. Access the application:
Open http://localhost:3000/listings in your browser.


---
Author: Shivansh Rajput