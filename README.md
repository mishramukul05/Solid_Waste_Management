# EcoManage

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

> A role-based solid waste management platform with image screening, request tracking, and field-worker verification.

## Overview

EcoManage is a full-stack web application for reporting, tracking, dispatching, and resolving solid waste complaints. Citizens can submit waste requests with location details and photo evidence, managers can review and organize those requests, and workers can verify cleanup work with image-based checks.

The app solves a common municipal workflow problem: taking waste complaints from the public, validating them, routing them to the right team, and keeping status updates visible to citizens in near real time.

### Main Features

- Citizen registration and login with JWT-based authentication.
- Role-specific portals for citizens, managers, and workers.
- Waste request creation with image upload and ML-based Clean/Dirty screening.
- Request status lifecycle: Pending, Dispatched, and Resolved.
- Manager dashboard for request triage, filtering, charts, and role management.
- Worker dashboard for district-specific tasks and cleanup verification.
- API validation and protected routes with Express middleware.

### Target Users

- Citizens reporting garbage or waste issues.
- Municipal managers supervising complaints and assignments.
- Field workers confirming cleanup progress with before/after photos.

## Live Demo

- Production frontend: https://solid-waste-management-frontend.onrender.com/
- Staging: not found in the repository
- Demo credentials: not documented in the repository

## Screenshots / Preview

No screenshot images were committed in the repository.

Available public asset paths:

- [frontend/public/favicon.svg](frontend/public/favicon.svg)
- [frontend/public/icons.svg](frontend/public/icons.svg)

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite, React Router DOM, Axios, Recharts |
| Backend | Node.js, Express 5, Mongoose |
| Database | MongoDB |
| Authentication | JSON Web Tokens, bcryptjs |
| Validation | express-validator |
| Styling | Tailwind CSS, PostCSS, Autoprefixer |
| ML / AI | Python, PyTorch, torchvision, Pillow |
| Deployment | Render frontend deployment; no Docker or CI files found |
| Testing | No automated test framework detected |
| Package Managers | npm |

## Project Architecture

The repository is split into three main areas:

```text
backend/
	config/          MongoDB connection setup
	controllers/     Route business logic
	middleware/      Auth and request validation
	models/          Mongoose schemas
	routes/          Express route definitions
	ML_Model/        Python image classification service and model artifacts

frontend/
	src/
		api.js         Shared Axios client
		App.jsx        App shell and route map
		pages/         Role-based pages and dashboards
		utils/         Shared location data
```

### App Flow

1. The browser loads the React app from [frontend/src/main.jsx](frontend/src/main.jsx#L6).
2. [frontend/src/App.jsx](frontend/src/App.jsx#L10) renders the global layout and routes users to the correct portal.
3. Authentication requests go to `/api/v1/auth/register` and `/api/v1/auth/login`.
4. JWTs are stored in `localStorage` by the frontend after login.
5. Protected API calls include a Bearer token and are verified by [backend/middleware/authMiddleware.js](backend/middleware/authMiddleware.js#L5).
6. Waste requests are created in MongoDB, and image submissions are screened by the Python ML service before saving.

### API Architecture

- `/api/v1/auth` handles registration and login.
- `/api/v1/requests` handles request creation, listing, status updates, deletion, and image verification.
- `/api/v1/users` handles manager-only user listing and role updates.

### Database Structure

The main collections are:

- `users` from [backend/models/User.js](backend/models/User.js#L3)
- `wasterequests` from [backend/models/WasteRequest.js](backend/models/WasteRequest.js#L3)

Important schema notes:

- `User.role` is limited to `citizen`, `manager`, or `worker`.
- `WasteRequest.status` is limited to `Pending`, `Dispatched`, or `Resolved`.
- `WasteRequest.citizenId` references `User` and is indexed.
- `WasteRequest.status` is indexed for dashboard queries.

## Features

- Role-based login flows for citizens, managers, and workers.
- Citizen report creation with title, description, category, location, and image proof.
- Image-based rejection of clean submissions through the ML prediction service.
- Citizen dashboard for viewing, filtering, and deleting their own reports.
- Manager dashboard with request analytics, user management, and status updates.
- Worker dashboard for jurisdiction-based tasks and cleanup verification.
- Before/after request image preview support.
- Location filtering using the bundled India state/district dataset.
- API documentation through the included Postman collection.

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd "Waste Management WebD"
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a [backend/.env](backend/.env) file with the variables listed below.

Start the backend in development mode:

```bash
npm run dev
```

For a production-style start:

```bash
npm start
```

The backend defaults to `http://localhost:5000`.

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server defaults to `http://localhost:5173`.

### 4. Python ML service

The Node backend starts the Python prediction server automatically if `ML_SERVER_URL` is not set. If you want to run it manually:

```bash
cd backend/ML_Model
python prediction_server.py 5001
```

### 5. Build commands

```bash
cd frontend
npm run build
```

```bash
cd backend/ML_Model
python model.py
```

The ML training script is included for reproducibility, but the repository already ships with `model.pth`.

## Environment Variables

### Backend `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_cluster_uri_here
JWT_SECRET=your_super_secret_jwt_string
ML_SERVER_URL=http://127.0.0.1:5001
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000
```

### Notes

- `ML_SERVER_URL` is optional. If omitted, the backend starts a local Python sidecar.
- `VITE_API_URL` is optional. If omitted, the frontend falls back to `http://localhost:5000`.

## Scripts

### Backend `package.json`

| Script | Command | Purpose |
| --- | --- | --- |
| `start` | `node server.js` | Starts the Express server |
| `dev` | `nodemon server.js` | Starts the backend with file watching |

### Frontend `package.json`

| Script | Command | Purpose |
| --- | --- | --- |
| `dev` | `vite` | Starts the Vite dev server |
| `build` | `vite build` | Produces a production bundle |
| `lint` | `eslint .` | Runs ESLint across the frontend |
| `preview` | `vite preview` | Serves the built frontend locally |

## API Documentation

### Base URL

- Local backend: `http://localhost:5000`
- API prefix: `/api/v1`

### Authentication Flow

1. Client posts credentials to `/api/v1/auth/login` or registration data to `/api/v1/auth/register`.
2. Server returns a JWT signed with `JWT_SECRET`.
3. Frontend stores the token in `localStorage` and sends it as `Authorization: Bearer <token>`.
4. Protected routes verify the token and load the current user from MongoDB.

### Endpoints

| Method | Endpoint | Purpose | Auth |
| --- | --- | --- | --- |
| `POST` | `/api/v1/auth/register` | Register a new user | No |
| `POST` | `/api/v1/auth/login` | Log in a user | No |
| `GET` | `/api/v1/requests` | List requests | Yes |
| `POST` | `/api/v1/requests` | Create a request | Yes |
| `GET` | `/api/v1/requests/:id` | Get one request | Yes |
| `PUT` | `/api/v1/requests/:id` | Update request status | Yes, manager or worker |
| `DELETE` | `/api/v1/requests/:id` | Delete a request | Yes |
| `POST` | `/api/v1/requests/verify-clean` | Verify a cleanup image | Yes |
| `GET` | `/api/v1/users` | List users | Yes, manager only |
| `PUT` | `/api/v1/users/:id/role` | Change a user role | Yes, manager only |

### Example Request

```http
POST /api/v1/requests
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
	"title": "Garbage near park gate",
	"description": "A pile of waste is blocking the entrance.",
	"wasteCategory": "Municipal Solid Waste",
	"location": "Ward 12, Indore, Madhya Pradesh",
	"image": "data:image/png;base64,iVBORw0KGgoAAA..."
}
```

### Example Response

```json
{
	"success": true,
	"prediction": "Dirty",
	"data": {
		"_id": "...",
		"title": "Garbage near park gate",
		"status": "Pending"
	}
}
```

### Postman Collection

The repository includes [Waste-Management-API-Collection.json](Waste-Management-API-Collection.json) for importing the API into Postman.

## Deployment

- Frontend deployment: Render, based on the live URL documented in the original README.
- Backend deployment: not explicitly documented in the repository.
- CI/CD: no pipeline files found.
- Docker / Kubernetes: no Dockerfile, docker-compose, or Kubernetes manifests found.

The original README also described a future scaling path with Docker, Kubernetes, Redis caching, and message queues such as RabbitMQ or Kafka. That is a roadmap idea, not an implemented deployment setup.

## Code Quality

- Linting is configured with ESLint in [frontend/eslint.config.js](frontend/eslint.config.js#L1).
- Styling is consistent with Tailwind utility classes and a shared theme in [frontend/tailwind.config.js](frontend/tailwind.config.js#L1).
- No TypeScript is used in this repository.
- No automated test framework was detected.

## Security

- Passwords are hashed with bcryptjs before storage.
- JWTs are used for authenticated API access.
- Route guards enforce authentication and role checks on sensitive endpoints.
- `express-validator` is used to validate registration and waste-request payloads.
- The backend limits JSON and URL-encoded bodies to 10 MB.

Security improvements still worth considering:

- Add rate limiting for login and request creation.
- Restrict CORS to known origins.
- Replace localStorage token storage with a safer session strategy if possible.
- Add centralized error handling and audit logging.

## Performance

Detected optimizations:

- Backend compression middleware is enabled.
- Image-heavy fetches are trimmed with `.select()` and `.lean()` in request queries.
- Request image blobs are only fetched on demand in the dashboards.
- MongoDB indexes exist on `status` and `citizenId` for request lookups.

Potential bottlenecks:

- Base64 image storage inflates payloads.
- The request list currently performs extra scans to detect whether images exist.
- The Python prediction service is single-process and synchronous.

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make focused changes with clear commits.
4. Run backend and frontend validation before submitting a pull request.
5. Include screenshots or API examples when changing UI or request behavior.

Suggested pull request checklist:

- No lint errors.
- No broken API routes.
- No accidental schema changes.
- README updated if behavior changes.

## Roadmap

Possible future improvements based on the current codebase:

- Add pagination and server-side filtering for requests.
- Move images to object storage such as S3 or Cloudinary.
- Add a centralized notification model instead of deriving notifications in the UI.
- Introduce unit and integration tests for controllers and dashboards.
- Add Docker support for the backend, frontend, and ML service.
- Add a proper CI pipeline for linting and build validation.
- Replace the ad hoc Python HTTP server with a more scalable ML service.

## License

The backend declares the project license as ISC in [backend/package.json](backend/package.json#L11). No standalone LICENSE file was found in the repository.

## Credits

- Original live demo link preserved from the repository README.
- API collection preserved as [Waste-Management-API-Collection.json](Waste-Management-API-Collection.json).
- India state and district data provided in [frontend/src/utils/indiaData.js](frontend/src/utils/indiaData.js#L1).
