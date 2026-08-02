# StayHub - Full Stack Property Listing Web Application

StayHub is a full-stack property listing platform built using Node.js, Express, and MongoDB. The application enables users to explore, create, update, and manage property listings with user authentication and media storage.

Live Demo: https://stayhub-rental-app.onrender.com/

---

## Tech Stack

[<img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white">](https://developer.mozilla.org/en-US/docs/Web/HTML)
[<img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white">](https://developer.mozilla.org/en-US/docs/Web/CSS)
[<img src="https://img.shields.io/badge/javascript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black">](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[<img src="https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white">](https://getbootstrap.com/)
[<img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB">](https://expressjs.com/)
[<img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white">](https://www.mongodb.com/)
[<img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white">](https://nodejs.org/)

* Backend: Node.js, Express.js
* Database: MongoDB Atlas, Mongoose ODM
* Templating Engine: EJS (Embedded JavaScript)
* Cloud Storage: Cloudinary and Multer
* Authentication: Passport.js
* Frontend: HTML, CSS, Bootstrap, JavaScript

---

## Key Features

* User Authentication: Secure sign up, login, and session management using Passport.js.
* User Profiles: Dedicated profile views showing user specific posted listings and account statistics.
* Advanced Multi-Field Search: Search functionality supporting keyword matching across titles, locations, countries, and categories with duplicate prevention logic.
* Listing Management: Complete operations allowing users to view, create, edit, and delete property listings.
* Interactive Maps and Geocoding: Integration with Leaflet.js to render location coordinates, interactive markers, and custom popups for properties.
* Review Management: Interactive review system restricting users to a single review per listing with authorization controls to delete individual reviews.
* Cloud Image Uploads: Integration with Cloudinary and Multer to handle property image storage.
* Interactive UI and Filters: Responsive user interface featuring dynamic tax toggles and category sorting.
* Localized Formatting: Prices formatted in Indian Currency using local standards.

---

## Project Structure

```text
stayhub-rental-app/
│
├── controllers/     # Route logic and request handlers
├── init/            # Database seeding scripts and sample data
├── models/          # Mongoose schemas
├── public/          # Static assets
├── routes/          # Express router modules
├── utils/           # Utility functions and custom error handlers
├── views/           # EJS frontend templates
├── app.js           # Main application entry point
├── cloudConfig.js   # Cloudinary configuration settings
├── middleware.js    # Custom authentication and validation middlewares
├── schema.js        # Joi validation schemas
└── package.json     # Project metadata and dependencies
```
---
## Getting Started Locally

To run this project on a local machine, follow these steps:

### 1. Clone the repository

```bash
git clone https://github.com/shivansh-rajput-01/stayhub.git
cd stayhub
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Setup Environment Variables

Create a file named `.env` in the root directory and add the following configuration:

```env
MONGO_URL=your_mongodb_connection_string
SECRET=yoursessionsecret
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

### 4. Seed the Database

Populate the database with test listings:

```bash
node init/index.js
```

### 5. Start the Server

```bash
node app.js
```

Open [http://localhost:3000/listings](http://localhost:3000/listings) in a web browser.

## Author

**Shivansh Rajput**