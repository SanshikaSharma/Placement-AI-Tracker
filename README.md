# 🚀 Placement AI Tracker

A full-stack web application designed to simplify and improve the student placement process. It provides students with placement tracking, resume management, AI-based preparation tools, career analytics, job recommendations, and notifications, while giving administrators complete control over students, companies, applications, and placement data.

## 🌐 Live Demo

**Frontend:** https://placement-ai-tracker.vercel.app/

**Backend API:** https://placement-ai-tracker-backend.onrender.com/

## ✨ Features

### 👨‍🎓 Student Features

* Secure student registration and login
* Student profile management
* Placement dashboard
* Company browsing and job details
* One-click company application
* Application tracking
* Application withdrawal
* Resume upload and management
* Resume analysis
* Eligibility Predictor
* AI Interview Preparation
* Career Analytics
* Job Recommendations
* Notifications
* Email notifications
* Placement status tracking

### 👨‍💼 Admin Features

* Secure admin authentication
* Admin dashboard
* Student management
* Student details
* Company management
* Add, edit and delete companies
* Application management
* Application status updates
* Resume viewing/downloading
* Placement analytics
* Student career information
* Admin route protection

## 🤖 AI-Based Modules

### AI Resume Analyzer

Analyzes uploaded resumes and provides useful information for placement preparation.

### AI Interview Preparation

Provides interview questions and evaluates answers using rule-based scoring.

### Eligibility Predictor

Checks student eligibility based on placement requirements such as CGPA, branch and required skills.

### Career Analytics

Analyzes applications, interviews, selection status, profile completeness and other placement-related information to calculate career readiness.

### Job Recommendations

Matches student profiles with available companies using skills, branch, CGPA and other eligibility factors.

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* JavaScript
* Axios
* React Router
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs
* Nodemailer
* Multer
* Cloudinary
* PDF Parser

### Deployment

* Vercel — Frontend
* Render — Backend
* MongoDB Atlas — Database

## 🏗️ Project Structure

```text
Placement-AI-Tracker/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── data/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── uploads/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🔐 Security

The project includes:

* JWT-based authentication
* Password hashing using bcryptjs
* Role-based admin authorization
* Student data ownership protection
* Protected API routes
* Input validation
* ObjectId validation
* NoSQL injection protection
* Restricted company modification to admins
* Environment variables for secrets
* Sensitive files excluded from Git
* Secure application status updates

## ⚙️ Run Locally

### Backend

```bash
cd backend
npm install
npm start
```

Backend runs on:

```text
http://localhost:5001
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## 🔑 Environment Variables

Create:

```text
backend/.env
```

Example:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

Do not commit actual secrets to GitHub.

## 📊 Main Application Flow

```text
Student
   ↓
Login / Register
   ↓
Profile
   ↓
Companies
   ↓
Apply
   ↓
Application Tracking
   ↓
AI Resume / Eligibility
   ↓
AI Interview
   ↓
Career Analytics
   ↓
Job Recommendations
   ↓
Placement
```

Admin:

```text
Admin Login
     ↓
Admin Dashboard
     ↓
Students ─── Companies
     │           │
     └── Applications
             │
       Resume / Analytics
```

## 🎯 Project Objective

The main objective of Placement AI Tracker is to provide a centralized platform where students can manage their placement journey while administrators can efficiently manage placement-related activities.

## 🚀 Future Enhancements

* Advanced AI resume analysis using an external LLM
* More advanced interview evaluation
* Real-time notifications
* Advanced placement prediction
* Company-wise placement statistics
* Mobile application
* More detailed analytics dashboards

## 👩‍💻 Author

**Sanshika Sharma**

B.Tech Computer Science & Engineering

## ⭐ Project

If you find this project useful, consider giving the repository a ⭐ on GitHub.
