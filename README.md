# Blogging Site

A simple blog web application built using **Node.js**, **Express**, **MongoDB**, and **EJS** for templating. This project allows users to create an account, write blogs with cover images, read others' blogs, and manage their profile.

## Features

- User authentication (Signup, Login, Logout)
- Forgot password via email verification and OTP
- Blog creation with title, body, and cover image
- Responsive blog cards layout
- Profile management with image update support
- Clean and user-friendly UI using Bootstrap

## Technologies Used

- Node.js
- Express.js
- MongoDB + Mongoose
- EJS (Embedded JavaScript Templates)
- Multer (for handling image uploads)
- Bootstrap (for styling)
- Nodemailer (for sending emails)

## Folder Structure (simplified)

/BloggingSite
│
├── /public            # Static files (CSS, images)
├── /views             # EJS templates
│   ├── /partials      # Header, navbar, etc.
│   └── *.ejs          # Pages like login, signup, blog, etc.
├── /routes            # Express routes
├── /controllers       # Route handlers (optional, if used)
├── /models            # Mongoose schemas
├── app.js             # Main server file
└── package.json

