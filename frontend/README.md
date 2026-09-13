🏠 SmartHostel

Smart Hostel Room Booking & Management System

SmartHostel is a full-stack web application designed to digitize and simplify the college hostel room allocation process.

Instead of managing room allocation manually through paperwork and long queues, SmartHostel provides a centralized platform where students can select rooms, submit documents, track booking status, and receive approval from the warden, while administrators can monitor and manage the overall hostel system.

---

🚀 Key Features

👨‍🎓 Student

- Student registration and login
- View available hostels
- Browse hostel floors
- Interactive room selection
- View room availability
- Submit room booking request
- Upload required documents
- Track booking status
- View approved/rejected requests

👨‍💼 Warden

- Warden dashboard
- View student booking requests
- Check submitted student details
- Review uploaded documents
- Approve or reject booking requests
- Manage room allocation status

🛠️ Admin

- Centralized admin dashboard
- Monitor students and bookings
- View hostel and room information
- Monitor overall hostel activity
- Manage the hostel system from one place

---

🔄 System Workflow

Student Registration/Login
          ↓
     Student Dashboard
          ↓
      Select Hostel
          ↓
       Select Floor
          ↓
      Select Room
          ↓
   Enter Booking Details
          ↓
     Upload Documents
          ↓
   Booking Request Created
          ↓
      Warden Review
       ↙         ↘
   APPROVE       REJECT
      ↓             ↓
 Room Allocated   Request Rejected
      ↓
 Student Dashboard Updated

---

🧑‍💻 Tech Stack

Frontend

- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- React Router

Backend

- Node.js
- Express.js

Database

- MongoDB
- Mongoose

Development Tools

- VS Code
- Git
- GitHub
- npm

---

📂 Project Structure

SmartHostel/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md

---

⚙️ Installation & Setup

1. Clone the repository

git clone [YOUR_GITHUB_REPOSITORY_URL](https://github.com/krisiroy12/SmartHostel.git)

2. Open the project

cd SmartHostel

3. Install frontend dependencies

cd frontend
npm install

4. Start the frontend

npm run dev

5. Install backend dependencies

Open another terminal:

cd backend
npm install

6. Start the backend

node server.js

The application will then be available locally through the Vite development server.

---

🔐 Environment Variables

Create a ".env" file inside the backend directory if required.

Example:

PORT=5000
MONGO_URI=your_mongodb_connection_string

«Never upload real credentials, passwords, API keys, or database secrets to GitHub.»

---

🗄️ Database

SmartHostel uses MongoDB to store application data such as:

- Student information
- Hostel information
- Room information
- Booking requests
- Booking status
- Warden-related data

Mongoose is used to define schemas and communicate with MongoDB.

---

🎯 Problem Statement

Traditional hostel room allocation can involve:

- Manual paperwork
- Long queues
- Difficulty checking room availability
- Delayed verification
- Lack of centralized booking information
- Communication gaps between students and wardens

SmartHostel aims to solve these problems by providing a digital, transparent and centralized hostel management system.

---

💡 Our Solution

SmartHostel connects the major stakeholders of hostel allocation through a single platform.

        ┌──────────────┐
        │   STUDENT    │
        └──────┬───────┘
               │
               ▼
        Room Booking
               │
               ▼
        ┌──────────────┐
        │    WARDEN    │
        └──────┬───────┘
               │
        Verification
               │
               ▼
        Booking Decision
               │
               ▼
        ┌──────────────┐
        │    ADMIN     │
        └──────────────┘

This creates a smoother workflow from room selection to final allocation.

---

🌟 Why SmartHostel?

- 📱 Digital hostel booking
- 🗺️ Easy room selection
- 📄 Online document submission
- 🔍 Warden verification
- ⚡ Faster allocation process
- 📊 Centralized management
- 🔄 Real-time booking status
- 🔐 Structured backend and database
- 💻 Modern responsive web interface

---

🔮 Future Scope

Future versions of SmartHostel can include:

- Online hostel fee payment
- Automated room allocation
- AI-based room recommendations
- Student complaint management
- Hostel maintenance requests
- Attendance tracking
- Notifications and email alerts
- Mobile application
- Multi-college support

---

🔒 Security

The project follows basic security practices such as:

- Environment variables for sensitive configuration
- ".gitignore" for private/local files
- Backend validation
- Controlled API communication
- Structured database models

---

🏆 Hackathon Project

SmartHostel was developed as a college hackathon project with the goal of transforming the traditional hostel room allocation process into a simple and efficient digital experience.

Core Idea

«Select. Submit. Verify. Allocate.»

---

👥 Team

SmartHostel Team

- Krishnakumar — Full Stack Development
- HimanshuKumar
- Yash Kumar

---

📄 License

This project is developed for educational and hackathon purposes.

---

⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.