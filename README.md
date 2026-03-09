<div align="center">
  <img src="./frontend/public/favicon.ico" alt="SmartPrep Logo" width="80" height="80">
  
  # SmartPrep
  **Comprehensive Adaptive Study Planner and Exam Analytics Platform**
  
  [![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue.svg)](https://reactjs.org/)
  [![Backend](https://img.shields.io/badge/Backend-Spring%20Boot%203-brightgreen.svg)](https://spring.io/projects/spring-boot)
  [![Database](https://img.shields.io/badge/Database-PostgreSQL-blue.svg)](https://www.postgresql.org/)
  [![Styling](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg)](https://tailwindcss.com/)
  
  <p>
    SmartPrep is an AI-powered adaptive exam preparation platform designed to help students study smarter, track their progress with real analytics, manage backlogs effortlessly, and walk into their exams fully prepared and confident.
  </p>
</div>

---

## ✨ Key Features

- 🧠 **AI-Adaptive Planning**: Automatically builds a personalized daily study schedule based on your syllabus, exam date, and preferred study hours.
- 📈 **Deep Analytics**: Track score trends, subject mastery, and overall exam readiness with beautiful, real-time charts.
- 📝 **Mock Test Engine**: Take interactive, timed subject-wise mock tests and review detailed result breakdowns.
- 🔄 **Smart Backlog Recovery**: Missed a session? SmartPrep intelligently redistributes skipped topics across your remaining schedule.
- ⏳ **Exam Countdown & Alerts**: Stay on track with smart reminders and a live countdown to your exam day.
- 🏆 **Streaks & Achievements**: Build consistent study habits with daily streaks, gamified progress milestones, and leaderboards.

## 🛠️ Technology Stack

### Frontend

- **React 18** (with Vite for blazing-fast builds)
- **Tailwind CSS** (for clean, responsive, modern styling)
- **Recharts** (for interactive analytics dashboards)
- **Lucide React** (beautiful iconography)

### Backend

- **Java 17 & Spring Boot 3.2** (Robust, scalable REST APIs)
- **Spring Security & JWT** (Stateless, secure authentication)
- **Spring Data JPA / Hibernate** (ORM and database interactions)
- **PostgreSQL** (Primary relational database)

## 📁 Project Structure

```text
SmartPrep/
├── backend/                  # Java Spring Boot REST API
│   ├── src/main/java         # Controllers, Models, Services, Repositories, Security
│   ├── src/main/resources    # application.properties (Database config)
│   └── pom.xml               # Maven dependencies
│
└── frontend/                 # React frontend application
    ├── src/
    │   ├── components/       # Reusable UI components
    │   ├── pages/            # Page-level components (Auth, Dashboard, Planner, Tests)
    │   ├── services/         # Axios API integration
    │   └── store/            # Redux setup (Authentication State)
    ├── vite.config.js        # Vite config with API proxy
    └── vercel.json           # SPA Routing rules for Vercel deployment
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (v16 or higher)
- **Java Development Kit (JDK) 17**
- **Maven**
- **PostgreSQL**

### 1. Database Setup

1. Open PostgreSQL and create a database named `smartprep`:
   ```sql
   CREATE DATABASE smartprep;
   ```
2. Update the database credentials in `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/smartprep
   spring.datasource.username=YOUR_POSTGRES_USERNAME
   spring.datasource.password=YOUR_POSTGRES_PASSWORD
   ```

### 2. Backend Setup

Navigate to the backend directory, compile, and run the Spring Boot application:

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

> The backend server will start on `http://localhost:8081`.

### 3. Frontend Setup

Open a new terminal tab, navigate to the frontend directory, install dependencies, and start the development server:

```bash
cd frontend
npm install
npm run dev
```

> The React app will be accessible at `http://localhost:5173`.
> _(Note: The frontend is configured to proxy `/api` requests to the backend)._

## 🌐 Deployment

### Frontend (Vercel)

The `/frontend` folder is fully configured for Vercel.

1. Connect your GitHub repository to Vercel.
2. Under **Project Settings > General**, set the **Root Directory** to `frontend`.
3. The included `/frontend/vercel.json` ensures that single-page application (SPA) routing works properly without throwing 404 errors.

### Backend

The Spring Boot backend can be packaged into a standalone `.jar` using Maven (`mvn clean package`) and deployed to services like Render, Railway, AWS Elastic Beanstalk, or Heroku. Make sure to provide a production PostgreSQL database URL via environment variables.

---

<div align="center">
  <i>Built with ❤️ for students who want to study smarter, not harder.</i>
</div>
