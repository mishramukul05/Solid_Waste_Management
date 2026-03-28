# Waste Management System - Backend Developer (Intern) Assignment

This project is a full-stack web application designed as a submission for the Backend Developer (Intern) role. It implements a scalable REST API along with a functional React frontend for users to interact with.

## 🛠️ Tech Stack Used

**Backend:**
- **Node.js & Express.js:** REST API architecture, routing, and controllers.
- **MongoDB (Mongoose):** NoSQL database and strict schema modeling.
- **Security:** `bcryptjs` (Password hashing) & `jsonwebtoken` (JWT authentication).
- **Validation:** `express-validator` to ensure all incoming request body fields are safe.
- **Tools:** `cors` middleware for cross-origin requests, `dotenv` for secret environment states.

**Frontend:**
- **React.js (via Vite):** Fast, modern frontend library.
- **Styling:** Tailwind CSS (configured with `postcss` & `autoprefixer`).
- **Routing:** `react-router-dom` for handling page navigation and protecting the dashboard route.
- **HTTP Client:** `axios` for standardizing API calls and attaching JWT tokens.

---

## ✅ Assignment Deliverables Status

- [x] **Backend Project Hosted** - Code structured with a clear separation of concerns (Controllers, Models, Routes, Middleware).
- [x] **User Registration & Login** - Passwords mathematically hashed and tokens generated.
- [x] **Role-Based Access Control** - Distinct `citizen` and `manager` level rules mapped to specific API endpoints.
- [x] **CRUD APIs for Waste Requests** - Creating, Reading, Updating status, and Deleting records properly managed against authorization middleware.
- [x] **API Versioning & Validation** - All paths sit behind `/api/v1/` and reject malformed JSON.
- [x] **Basic Frontend UI** - Fully working React app handling login, state management, and protected dashboards to visualize the APIs smoothly.
- [x] **API Documentation** - A fully exported Postman collection is attached in this repository (`Waste-Management-API-Collection.json`).
- [x] **Scalability Note** - Documented below!

---

## 🚀 How to Run the Project Locally

### 1. Database & Environment Setup
Ensure you create a `.env` file within the `/backend` directory containing:
```env
PORT=5000
MONGO_URI=your_mongodb_cluster_uri_here
JWT_SECRET=your_super_secret_jwt_string
```

### 2. Backend Server
1. Open the terminal and navigate to the backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Start the server in Dev Mode: `npm run dev`
*(The server will start on `http://localhost:5000`)*

### 3. Frontend Client
1. Open a new terminal and navigate to the frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Vite development server: `npm run dev`
*(Your browser will open `http://localhost:5173`)*

---

## 📖 API Documentation (Postman)

To interact with the backend APIs via Postman rather than the React app:
1. Open Postman.
2. Click **Import**.
3. Select the `Waste-Management-API-Collection.json` file included in the root directory.

It outlines exactly how to pass the Bearer tokens, exact URLs, methods (`POST`, `GET`, `PUT`, `DELETE`), and provides exact body configurations for the 6 endpoints required.

---

## 📈 Scalability & Deployment Note

While this system functions perfectly as a standard Express/Node MVC monolith, here is how the architecture would dynamically scale per assignment instructions:

**1. Microservices Separation:**
As modules grow, the `Auth` system and the `Waste Requests` platform could be broken apart into decoupled microservices, potentially utilizing **RabbitMQ** or **Apache Kafka** if asynchronous message-passing (like automated "Waste Picked Up" email triggers) becomes a requirement.

**2. Distributed Deployment & Containerization:**
Deploying standard monoliths can bottleneck. Utilizing **Docker** containers for both the Frontend UI and Backend API enables us to pair the project with **Kubernetes (K8s)**. Orchestrated alongside an AWS ALB (Application Load Balancer), pods could automatically spin up or terminate depending on daytime user traffic congestion.

**3. Database Caching:**
Instead of Managers constantly hitting the raw MongoDB cluster directly to fetch the entirety of the city's active trash requests (`GET`), introducing an intermediate **Redis Cache** cluster to serve rapidly executing read operations would heavily alleviate database cost & latency. Indexes would equally be applied to the `status` and `citizenId` fields on the `WasteRequest` schema collection internally.
