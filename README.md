# wal-backed-kv-store

A WAL-backed key-value storage engine inspired by modern distributed databases.  
Provides fast in-memory reads, append-only disk persistence, crash recovery through log replay, and an HTTP API.  
Includes a Next.js UI and Dockerized setup for local experimentation.

---

## 🚀 Overview

This project implements a **core storage engine** that demonstrates how real-world databases ensure durability and recovery.

At a high level:
- Data lives **in memory** for fast access
- Every write is first recorded in an **append-only Write-Ahead Log (WAL)**
- On crashes or restarts, the system **replays the WAL** to rebuild state
- A RESTful API exposes storage operations
- A Next.js UI allows interactive usage
- The entire system runs locally using Docker

This project focuses on **storage fundamentals**, not just CRUD.

---

## 🧠 Key Concepts

- **Key-Value Store**  
  Stores data as simple `key → value` pairs

- **Write-Ahead Logging (WAL)**  
  Ensures durability by persisting writes before applying them

- **Crash Recovery**  
  Rebuilds in-memory state by replaying WAL entries at startup

- **In-Memory Index**  
  Enables fast reads and writes

- **Append-Only Persistence**  
  WAL writes are sequential and safe against partial failures

---

## 🏗️ Architecture

```
Client (Browser / API Client)
│
▼
HTTP API (Express)
│
▼
In-Memory Key-Value Store
│
▼
Write-Ahead Log (Disk)
```

### Write Flow
1. Client sends a PUT/DELETE request
2. Operation is appended to the WAL
3. In-memory state is updated
4. Response is returned

### Recovery Flow
1. Server starts
2. WAL file is read line-by-line
3. Operations are replayed in order
4. In-memory store is rebuilt

---

## 📁 Project Structure

```
wal-backed-kv-store/
├── backend/
│   ├── src/
│   │   ├── server.js          # Express server
│   │   ├── storageEngine.js   # In-memory + WAL logic
│   │   └── config.js
│   ├── data/                  # WAL files (persisted)
│   └── package.json
│
├── frontend/
│   ├── app/                   # Next.js UI
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## 🔌 HTTP API

### Health Check
```
GET /health
```

### Get all key-value pairs
```
GET /kv
```

### Get value by key
```
GET /kv/:key
```

### Set / Update a key
```
PUT /kv/:key
Content-Type: application/json

{
"value": "example"
}
```

### Delete a key
```
DELETE /kv/:key
```

---

## 🖥️ Web UI

The Next.js frontend provides:
- Set / update key-value pairs
- Fetch values by key
- Delete keys
- View all stored data

The UI is useful for visually verifying durability and crash recovery.

---

## 🐳 Running with Docker (Recommended)

### Prerequisites
- Docker
- Docker Compose

### Build and run

```bash
docker-compose build
docker-compose up
```

* Frontend: [http://localhost:3000](http://localhost:3000)
* Backend API: [http://localhost:4000](http://localhost:4000)

### Crash Recovery Demo

1. Insert some keys via UI
2. Restart backend container:

   ```bash
   docker-compose restart backend
   ```
3. Refresh UI — data persists ✅

---

## 🧪 Running Locally (Without Docker)

### Backend

```bash
cd backend
npm install
npm start
```

Runs on `http://localhost:4000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:3000`

---

## 🎯 Why This Project?

This project demonstrates real storage-system ideas used in:

* Databases
* Distributed systems
* Infrastructure platforms

It focuses on:

* Durability
* Failure handling
* Separation of memory and persistence
* Clean system design

---

## 🔮 Future Improvements

* WAL compaction
* Snapshots
* SSTables
* Multi-node replication
* Leader–follower model
* Monitoring & metrics

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express
* **Frontend:** Next.js
* **Storage:** In-memory + Write-Ahead Log
* **Infra:** Docker, Docker Compose

---

## 📌 Keywords

key-value-store
write-ahead-log
storage-engine
crash-recovery
distributed-systems
nodejs
express
docker
persistence
database-internals

---

## 📄 License

MIT License
