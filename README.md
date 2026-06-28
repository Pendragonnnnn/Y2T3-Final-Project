# Smart Library Seat Reservation System

Full-stack MVC web application: **React** (frontend) + **Express** (backend, MVC pattern) + **MySQL** (database). Includes a Logistic Regression-style sentiment classifier for post-checkout student feedback.

## Project structure

```
smart-library/
├── backend/                  Express MVC API
│   ├── database/
│   │   ├── schema.sql        3NF database schema + seed seats
│   │   └── seed.js           Seeds demo manager/student accounts
│   ├── src/
│   │   ├── config/db.js      MySQL connection pool
│   │   ├── models/           M — User, Seat, Reservation, PenaltyRecord,
│   │   │                       Notification, Feedback
│   │   ├── controllers/      C — business logic per resource
│   │   ├── routes/           Express route definitions
│   │   ├── middleware/auth.js  JWT auth + role-based access control
│   │   ├── services/
│   │   │   └── sentimentClassifier.js   Logistic Regression-style classifier
│   │   └── app.js            Express app assembly
│   └── server.js             Entry point
│
└── frontend/                 React (Vite) SPA
    └── src/
        |__ assets            Store images, icons, fonts, and static file together.
        ├── components/       Reusable UI: Button, SeatGrid, BottomNav, etc.
        ├── pages/             V — Login, Home, SeatMap, Reservations,
        │                        Profile, Feedback, Manager* screens
        ├── context/AuthContext.jsx   Global auth state
        ├── services/api.js   Axios client w/ JWT interceptor
        └── styles/global.css Design tokens (matches Figma blue theme)
```

## 1. Database setup

```bash
mysql -u root -p < backend/database/schema.sql
```

This creates the `smart_library` database, all tables, and seeds the seat layout (3 tables, 12 seats).

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env with your MySQL credentials and a JWT secret
npm run seed     # creates demo accounts
npm run dev      # starts on http://localhost:5000
```

### Demo accounts (after seeding)
| Role    | Email                 | Password    |
|---------|------------------------|-------------|
| Manager | manager@library.edu    | password123 |
| Student | miguel@student.edu     | password123 |
| Student | alice@student.edu      | password123 |

## 3. Frontend setup

```bash
cd frontend
npm install
npm run dev      # starts on http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:5000`, so just run both servers and open `http://localhost:5173`.

## Core flows implemented

- **Auth** — register/login (student or manager), JWT-protected routes, role-based access control
- **Student** — quick random reserve, manual seat picker (real-time map), view/cancel reservations, request checkout, view penalty score + history
- **Manager** — accept/reject reservations, approve checkout, view all students + penalty scores, analytics report
- **Penalty system** — no-show triggers a penalty record + score increase + notification (rejection by manager does NOT penalize the student)
- **Feedback + Logistic Regression** — after checkout, students rate (1–5 stars) and optionally leave a comment. The comment is classified into **Frustrated / Neutral / Satisfied** by `sentimentClassifier.js`, and aggregated results appear on the manager's analytics report (donut charts)

## About the Logistic Regression classifier

`backend/src/services/sentimentClassifier.js` reproduces the same **pipeline** a trained scikit-learn model would use (pre-process → weighted feature scoring → softmax → classification), but uses a hand-built lexicon instead of trained weights, so it runs instantly with no Python dependency for the demo.

To swap in a real trained model later:
1. Train a `TfidfVectorizer` + `LogisticRegression` in Python on labelled interview/feedback data
2. Export it as a `.pkl` and serve it via a small Flask endpoint (`POST /classify`)
3. Replace the body of `classifyFeedback()` in `sentimentClassifier.js` with an `axios.post()` call to that Flask service

This keeps the rest of the system (controller, routes, DB writes) unchanged.

## Notes on scope (see proposal limitations)

- Authentication here is self-contained (not integrated with a university SSO) — acceptable for a student project demo
- No separate "Admin" role — Manager handles both daily operations and reporting, matching real-world library staffing
- Push notifications are stored in-app (`notification` table) rather than sent via mobile push
- The seat map refreshes on manual reload rather than via WebSockets — a reasonable simplification for the prototype
"# Y2T3-Final-Project" 
"# Y2T3-Final-Project" 
