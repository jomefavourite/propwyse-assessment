# 🧩 User Management System (Frontend Assessment)

A **Next.js** frontend application that interacts with a **mock REST API** to provide full CRUD operations for managing users. Built for performance, developer clarity, and local mocking capabilities.

---

## 🗂 Tech Stack

- **Next.js 15**
- **TypeScript**
- **TailwindCSS**
- **React Query**
- **JSON Server** – for fast prototyping of a REST API
- **Prism (Stoplight)** – to mock an OpenAPI spec with validation
- **Docker + Docker Compose**

---

## 📌 Purpose & Design Assumptions

### ✅ Why `json-server`?
- Provides a quick, filesystem-based REST API using a `db.json` file.
- It is stateful (remembers the state of data saved)
- Useful during early frontend development stages when a real backend isn't ready.
- Supports all HTTP verbs (GET, POST, PUT, DELETE) out of the box.

### ✅ Why `Prism`?
- Proxies requests through an OpenAPI spec (`user-api.yaml`) to validate:
  - API contract adherence
  - Correct response codes (e.g. `200`, `404`)
- Useful for ensuring your frontend complies with API specifications.

---

## 📁 Project Structure

```
.
├── db.json                # Mock data source for json-server
│    
├── openapi/
│   └── user-api.yaml          # OpenAPI definition for Prism validation
│
├── app/
│   └── user/[id]/page.tsx     # Dynamic User page with error handling
│
├── components/                # UI components and providers
├── Dockerfile                 # Frontend container
├── docker-compose.yml         # Orchestration for mock-api + frontend
└── README.md                  # This file
```

---

## 🛠 How to Run the App Locally (No Docker)

### 1. Install dependencies

```bash
npm install
```

### 2. Run `json-server` and `prism` with the frontend

```bash
npm run dev
```

This will concurrently:
- Start Next.js
- Start json-server at `http://localhost:3001`
- Start Prism proxy at `http://localhost:4010` (your `NEXT_PUBLIC_API_BASE_URL`)

---

## 🐳 Running with Docker (Recommended for Consistency)

### 1. Build & Start containers

```bash
docker-compose up --build
```

### 2. Access the app

- Frontend: http://localhost:3000
- Mock JSON API (internal): http://mock-api:3001
- Validated API via Prism: http://localhost:4010

Make sure you use `NEXT_PUBLIC_API_BASE_URL=http://localhost:4010` in your `.env` or Docker `environment:` section for the frontend to call Prism.

---

## ⚠️ Known Issues & Notes

- `DELETE` endpoints must return either `204 No Content` or `404 Not Found` to pass OpenAPI validation in Prism.
- The file `user-api.yaml` must match all status codes your API returns. Prism throws 500 errors for unknown statuses.

---

## 🧪 Testing API Endpoints (Optional)

- `GET /users` – Fetch all users
- `GET /users/:id` – Fetch single user
- `POST /users` – Create a user
- `PUT /users/:id` – Update a user
- `DELETE /users/:id` – Delete a user

You can test these endpoints directly via `http://localhost:4010` using tools like Postman or Insomnia.

---

## 📄 License

MIT — free to use, modify, and distribute.