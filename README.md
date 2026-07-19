#  Smart Library Seat Reservation System

Full-stack MVC web application: **React** (frontend) + **Express** (backend, MVC pattern) + **MySQL** (database). Includes a Logistic Regression-style sentiment classifier for post-checkout student feedback.
---

## 📖 Overview

The **Smart Library Seat Reservation System** is a digital platform designed to enable students to remotely check seat availability and reserve study spaces. Traditional libraries require students to physically visit without knowing whether seats are available, leading to wasted travel time and inefficient use of library resources.

By digitizing the reservation process, we provide:
- **Real-time seat availability** information
- **Remote seat reservation** before arriving
- **Efficient management** for library staff
- **Enhanced student experience** with notifications and feedback

---

## ✨ Features

### 👨‍🎓 Student Features
- **User Authentication** - Register, Login, Profile management
- **Interactive Seat Map** - Real-time seat availability with drag/zoom
- **Quick Random Reserve** - Instantly grab any available seat
- **Manual Seat Selection** - Choose specific seats from the map
- **QR Code Check-in/out** - Scan QR codes for seamless entry/exit
- **Reservation Management** - View, cancel, and track reservations
- **Real-time Notifications** - Get updates on reservation status
- **Feedback System** - Rate experience with AI-powered sentiment analysis
- **Dark Mode** - Toggle between light and dark themes
- **FAQ Section** - Quick answers to common questions

### 👔 Manager Features
- **Reservation Dashboard** - View and manage all active/pending reservations
- **QR Scanner Station** - Scan student QR codes for check-in/out
- **Seat Management** - Block/open seats from the interactive map
- **Student Management** - View all students with search functionality
- **Analytics Reports** - Track seat occupancy, reservation trends, and feedback
- **Feedback Management** - View categorized user feedback
- **Student History** - View individual student reservation history

### 🤖 AI-Powered Feedback Classification
- **Sentiment Analysis** - Comments classified into: Bug, Feature Request, Management Issue, or General
- **Logistic Regression-style** classifier using lexicon-based scoring
- **Real-time Classification** - Instant feedback categorization
- **Manager Analytics** - View sentiment breakdown with charts

---

## 🛠️ Technologies

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** | RESTful API framework |
| **MySQL** | Relational database |
| **JWT** | Authentication & authorization |
| **bcrypt** | Password hashing |
| **mysql2** | MySQL database driver |
| **dotenv** | Environment variables |
| **Swagger UI** | API documentation |
| **Nodemon** | Development auto-restart |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **Vite** | Build tool & dev server |
| **React Router DOM** | Navigation & routing |
| **Axios** | HTTP client |
| **QRCode.react** | QR code generation |
| **Poppins Font** | UI typography |

---

## 🏗️ System Architecture

The application follows a **3-Tier Architecture**:

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRESENTATION TIER                      │
│                      React Frontend (Vite)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  Pages   │  │Components│  │  Context │  │  Styles  │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
└─────────────────────────────────────────────────────────────────┘
                              │ HTTP/API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         APPLICATION TIER                       │
│                      Express.js Backend                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  Routes  │  │Controllers│  │ Services │  │ Middleware│     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
└─────────────────────────────────────────────────────────────────┘
                              │ SQL
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                           DATA TIER                            │
│                        MySQL Database                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  Users   │  │  Seats   │  │Reservations│  │ Feedback │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────┐     ┌─────────────────┐     ┌─────────────┐
│    User     │     │ Reservation_    │     │    Seat     │
├─────────────┤     │    Record       │     ├─────────────┤
│ user_id (PK)│◄────│ user_id (FK)    │     │ seat_id (PK)│
│ email       │     │ seat_id (FK)    │────►│ table_id(FK)│
│ password    │     │ reservation_date│     │ current_    │
│ full_name   │     │ start_time      │     │  status     │
│ role        │     │ check_in_time   │     └─────────────┘
└─────────────┘     │ end_time        │           │
      │             │ outcome         │           │
      │             └─────────────────┘           │
      │                    │                      │
      │                    │                      │
      ▼                    ▼                      ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Notification│     │  Feedback   │     │ Library_    │
├─────────────┤     ├─────────────┤     │   Table     │
│ notif_id(PK)│     │ feedback_id │     ├─────────────┤
│ recipient_id│     │ user_id(FK) │     │ table_id(PK)│
│ title       │     │ star_rating │     │ table_label │
│ message_body│     │ comment     │     │ positionX   │
│ is_read     │     │ sentiment   │     │ positionY   │
│ created_at  │     │ confidence  │     │ rotation    │
└─────────────┘     │ created_at  │     └─────────────┘
                    └─────────────┘
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/Pendragonnnnn/Y2T3-Final-Project.git
```

### 2. Database Setup
```bash
# Navigate to backend directory
cd backend

# Create database and tables
mysql -u root -p < database/schema.sql

# Seed demo data
mysql -u root -p < database/seed.sql
```

### 3. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=yourpassword
# DB_NAME=LibraryReservationDB
# JWT_SECRET=your_secret_key

# Start backend server
npm run dev
```
Backend runs on `http://localhost:5000`

### 4. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Frontend runs on `http://localhost:5173`

### 5. Access the Application
Open your browser and navigate to `http://localhost:5173`

---

## 👤 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| **Student** | alice@university.edu | pass1 |
| **Manager** | bob@library.edu | pass2 |

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user profile |
| POST | `/api/auth/change-password` | Change user password |
| PATCH | `/api/auth/update-name` | Update user name |

### Reservation Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reservations/quick` | Quick random seat reservation |
| POST | `/api/reservations/manual` | Manual seat reservation |
| GET | `/api/reservations/mine` | Get active reservations |
| GET | `/api/reservations/history` | Get reservation history |
| DELETE | `/api/reservations/:id` | Cancel reservation |
| GET | `/api/reservations/check-status` | Check active reservation |
| POST | `/api/reservations/scan-checkin` | QR check-in |
| POST | `/api/reservations/scan-checkout` | QR check-out |

### Seat Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/seats` | Get seat map |
| GET | `/api/seats/stats` | Get seat statistics |
| GET | `/api/seats/manager-map` | Manager seat map |
| PATCH | `/api/seats/:id/block` | Block seat |
| PATCH | `/api/seats/:id/open` | Open seat |

### Manager Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/manager/students` | List all students |
| GET | `/api/manager/report` | Analytics report |
| GET | `/api/manager/feedback/management-issues` | Get management issues |

### Feedback Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/feedback` | Submit feedback |
| POST | `/api/feedback/preview` | Preview sentiment classification |
| GET | `/api/feedback/breakdown` | Get sentiment breakdown |

### Notification Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications/:userId` | Get user notifications |
| GET | `/api/notifications/:userId/count` | Get unread count |
| PUT | `/api/notifications/:userId/read/:id` | Mark notification as read |
| PUT | `/api/notifications/:userId/read-all` | Mark all as read |

**API Documentation:** After running the backend, visit `http://localhost:5000/api/docs` for Swagger UI.

---

## 📁 Project Structure

```
smart-library-reservation/
├── backend/
│   ├── database/
│   │   ├── schema.sql              # Database schema
│   │   └── seed.sql                # Seed data
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MySQL connection pool
│   │   ├── controllers/
│   │   │   ├── authController.js   # Authentication logic
│   │   │   ├── reservationController.js
│   │   │   ├── seatController.js
│   │   │   ├── managerController.js
│   │   │   ├── feedbackController.js
│   │   │   └── notificationController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Seat.js
│   │   │   ├── Reservation.js
│   │   │   ├── Feedback.js
│   │   │   ├── Notification.js
│   │   │   └── PenaltyRecord.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── reservationRoutes.js
│   │   │   ├── seatRoutes.js
│   │   │   ├── managerRoutes.js
│   │   │   ├── feedbackRoutes.js
│   │   │   └── notificationRoutes.js
│   │   ├── middleware/
│   │   │   └── auth.js             # JWT & role middleware
│   │   ├── services/
│   │   │   └── sentimentClassifier.js  # AI sentiment analysis
│   │   ├── jobs/
│   │   │   └── noShowJob.js        # Auto-cancel no-shows
│   │   └── app.js                  # Express app
│   ├── .env.example
│   ├── package.json
│   └── server.js                   # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   │   ├── s1.png              # Light mode logo
│   │   │   ├── s3.png              # Dark mode logo
│   │   │   ├── person.svg
│   │   │   ├── closeEye.png
│   │   │   └── open_eye.png
│   │   ├── components/
│   │   │   ├── BottomNav.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── InteractiveSeatMap.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── SeatGrid.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── useToast.js
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── SeatMap.jsx
│   │   │   ├── MyReservations.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Feedback.jsx
│   │   │   ├── FAQ.jsx
│   │   │   ├── Notification.jsx
│   │   │   ├── ManagerDashboard.jsx
│   │   │   ├── ManagerStudents.jsx
│   │   │   ├── ManagerReport.jsx
│   │   │   ├── ManagerScanner.jsx
│   │   │   ├── ManagerMap.jsx
│   │   │   ├── ManagementIssueList.jsx
│   │   │   └── StudentHistory.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global auth state
│   │   ├── services/
│   │   │   └── api.js              # Axios client with JWT interceptor
│   │   ├── styles/
│   │   │   └── global.css          # Global styles with dark mode
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── README.md
└── package.json
```

---

### Student View
| Screen | Description |
|--------|-------------|
| **Login** | Secure login with JWT authentication |
| **Home** | Seat availability stats, quick reserve, peak hours |
| **Seat Map** | Interactive map with real-time seat status |
| **Reservations** | QR codes for check-in/out with countdown |
| **Profile** | Edit name, change password, dark mode toggle |
| **Feedback** | Star rating with AI sentiment classification |

### Manager View
| Screen | Description |
|--------|-------------|
| **Dashboard** | View and manage active/pending reservations |
| **QR Scanner** | USB scanner integration for check-in/out |
| **Seat Management** | Block/open seats from interactive map |
| **Students** | View all students with search |
| **Analytics** | Occupancy charts, reservation trends, feedback |

---

## 🔧 Key Features Explained

### 🔐 Authentication & Security
- JWT-based authentication with 7-day expiry
- Role-based access control (Student/Manager)
- Protected routes for both frontend and backend
- Password hashing for security

### 🪑 Interactive Seat Map
- Drag to pan, scroll to zoom
- Real-time seat status (Available/Occupied/Blocked)
- Color-coded seating (green/red/gray)
- Manager mode shows occupant names

### 📱 QR Code System
- Dynamic QR generation for check-in/out
- 30-minute check-in window with countdown
- USB scanner integration for managers
- Automatic no-show penalty after 30 minutes

### 🤖 Sentiment Analysis
- Logistic Regression-style classifier
- Categories: Bug, Feature Request, Management Issue, General
- Real-time classification with confidence scores
- Manager dashboard with sentiment breakdown

### 📊 Analytics Dashboard
- Seat occupancy donut charts
- Reservation statistics (Today/Week/Month)
- Peak booking hours visualization
- User feedback sentiment breakdown

---

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm run test
```

---

## 🚧 Limitations & Future Enhancements

### Current Limitations
- No book borrowing/cataloging functionality
- Library map layout is database-admin configured
- No WebSocket for real-time seat updates
- No integration with university SSO
- No mobile push notifications

### Future Enhancements
- **Drag-and-drop library layout** for managers
- **Book loaning mechanics** integration
- **WebSocket** for real-time seat updates
- **Mobile app** (React Native)
- **SSO integration** with university systems
- **Advanced analytics** with predictive modeling

---

## 📄 License

This project is developed for educational purposes as part of the final project at Cambodia Academy of Digital Technology (CADT).

---

## 🙏 Acknowledgments

- **Cambodia Academy of Digital Technology (CADT)** for the opportunity
- **Supervisors** for guidance and feedback
- **Figma** for design inspiration
- **Open-source community** for the amazing tools
