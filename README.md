# WAL-Backed Key-Value Store with Queue Support

A production-grade WAL-backed storage engine with dual data structures: **Key-Value Store** and **FIFO Queues**.  
Features crash recovery, ROM persistence, configurable durability modes, and a modern Next.js UI.

---

## 🚀 Overview

This project implements a **complete storage engine** demonstrating how modern databases ensure durability, consistency, and crash recovery.

### Key Features

- **Dual Data Structures**: Key-Value pairs + FIFO Queues
- **Write-Ahead Logging (WAL)**: Ensures durability with configurable sync modes
- **ROM Persistence**: Atomic snapshots for fast recovery
- **Crash Recovery**: Automatic replay of uncommitted operations
- **RESTful APIs**: Full CRUD for both KV and Queue operations
- **Modern UI**: Next.js frontend with Tailwind CSS and shadcn/ui
- **Modular Architecture**: Clean separation of concerns

---

## 🧠 Core Concepts

### Write-Ahead Logging (WAL)
Every write operation is logged **before** being applied to memory. This ensures:
- **Durability**: Data survives crashes
- **Atomicity**: Operations are all-or-nothing
- **Recovery**: Uncommitted operations can be replayed

### ROM (Read-Only Memory) Persistence
Periodic snapshots of the entire database state to disk:
- **Atomic writes**: Uses temp file + rename pattern
- **Fast recovery**: Load snapshot, then replay WAL
- **Checkpoint optimization**: Truncate WAL after ROM sync

### Crash Recovery Process
1. **Load ROM**: Restore last known good state
2. **Read WAL**: Parse all log entries
3. **Filter uncommitted**: Identify operations without COMMIT entries
4. **Replay**: Re-execute uncommitted operations
5. **Save ROM**: Persist recovered state

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│           Client (Browser / API)                │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│         Express HTTP API Layer                  │
│  ┌──────────────────┐  ┌──────────────────┐    │
│  │  KV Routes       │  │  Queue Routes    │    │
│  │  /api/kv/*       │  │  /api/queue/*    │    │
│  └──────────────────┘  └──────────────────┘    │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│         Business Logic Layer                    │
│  ┌──────────────────┐  ┌──────────────────┐    │
│  │  KV Controller   │  │  Queue Module    │    │
│  └──────────────────┘  └──────────────────┘    │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│         In-Memory Store (RAM)                   │
│  { key: value, queues: { queueName: [...] } }  │
└────────┬────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│         Persistence Layer                       │
│  ┌──────────────────┐  ┌──────────────────┐    │
│  │  WAL Module      │  │  ROM Module      │    │
│  │  (wal.log)       │  │  (db.json)       │    │
│  └──────────────────┘  └──────────────────┘    │
└─────────────────────────────────────────────────┘
```

### Write Flow (WAL → RAM → ROM → Commit)
1. **WAL**: Log operation with STARTED status
2. **RAM**: Update in-memory database
3. **ROM**: Persist snapshot to disk
4. **Commit**: Mark operation as complete in WAL

---

## 📁 Project Structure

```
wal-backed-kv-store/
├── backend/
│   ├── config/
│   │   └── config.js           # Centralized configuration
│   ├── controllers/
│   │   └── kv.controller.js    # KV business logic
│   ├── queue/
│   │   └── queue.js            # Queue operations
│   ├── routes/
│   │   ├── kv.routes.js        # KV API endpoints
│   │   └── queue.routes.js     # Queue API endpoints
│   ├── store/
│   │   └── memory.store.js     # In-memory database
│   ├── wal/
│   │   ├── wal.js              # WAL implementation
│   │   └── recover.js          # Crash recovery logic
│   ├── rom/
│   │   └── rom.js              # ROM persistence
│   ├── data/                   # Persisted files (gitignored)
│   │   ├── wal.log
│   │   └── db.json
│   ├── index.js                # Server entry point
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Main page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   └── ui/                 # shadcn/ui components
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## 🔌 API Reference

### Key-Value Store API

#### Get all key-value pairs
```http
GET /api/kv
```

**Response:**
```json
{
  "success": true,
  "data": { "key1": "value1", "key2": "value2" }
}
```

#### Get value by key
```http
GET /api/kv/:key
```

**Response:**
```json
{
  "success": true,
  "key": "myKey",
  "value": "myValue"
}
```

#### Set/Update a key
```http
POST /api/kv/:key
Content-Type: application/json

{
  "value": "newValue"
}
```

**Response:**
```json
{
  "success": true,
  "key": "myKey",
  "value": "newValue"
}
```

#### Delete a key
```http
DELETE /api/kv/:key
```

**Response:**
```json
{
  "success": true,
  "key": "myKey"
}
```

---

### Queue API

#### List all queues
```http
GET /api/queue
```

**Response:**
```json
{
  "success": true,
  "queues": ["queue1", "queue2"],
  "count": 2
}
```

#### Enqueue (add item)
```http
POST /api/queue/:queueName/enqueue
Content-Type: application/json

{
  "value": "item1"
}
```

**Response:**
```json
{
  "success": true,
  "queue": "myQueue",
  "value": "item1",
  "size": 5
}
```

#### Dequeue (remove and return first item)
```http
POST /api/queue/:queueName/dequeue
```

**Response:**
```json
{
  "success": true,
  "queue": "myQueue",
  "value": "item1"
}
```

#### Peek (view first item without removing)
```http
GET /api/queue/:queueName/peek
```

**Response:**
```json
{
  "success": true,
  "queue": "myQueue",
  "value": "item1"
}
```

#### Get queue size
```http
GET /api/queue/:queueName/size
```

**Response:**
```json
{
  "success": true,
  "queue": "myQueue",
  "size": 5
}
```

#### Clear queue
```http
DELETE /api/queue/:queueName
```

**Response:**
```json
{
  "success": true,
  "queue": "myQueue"
}
```

---

## 🖥️ Web UI

The Next.js frontend provides an interactive interface for:

### Key-Value Operations
- ✅ Set/Update key-value pairs
- ✅ Get values by key
- ✅ Delete keys
- ✅ View all stored data

### Queue Operations
- ✅ Create and manage queues
- ✅ Enqueue/Dequeue items
- ✅ Peek at queue contents
- ✅ Monitor queue sizes

### Features
- 🎨 Modern UI with Tailwind CSS
- 🌓 Dark mode support
- 📱 Fully responsive
- 🔔 Toast notifications (Sonner)
- ⚡ Real-time updates

---

## 🐳 Running with Docker

### Prerequisites
- Docker
- Docker Compose

### Quick Start

```bash
# Build and start services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Access Points:**
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:4000](http://localhost:4000)
- KV API: [http://localhost:4000/api/kv](http://localhost:4000/api/kv)
- Queue API: [http://localhost:4000/api/queue](http://localhost:4000/api/queue)

### Crash Recovery Demo

1. **Add data** via UI or API
2. **Kill backend container**:
   ```bash
   docker-compose kill backend
   ```
3. **Restart backend**:
   ```bash
   docker-compose up backend
   ```
4. **Verify data persists** ✅

---

## 🧪 Running Locally (Without Docker)

### Backend

```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:4000`

**Startup logs:**
```
=== Starting WAL-Backed KV Store ===
📦 Loaded state from ROM
🔄 Starting WAL recovery...
✅ All operations committed, no recovery needed
=== Recovery Complete ===

🚀 Server is running on http://localhost:4000
📊 Key-Value API: http://localhost:4000/api/kv
📋 Queue API: http://localhost:4000/api/queue
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:3000`

---

## ⚙️ Configuration

Edit `backend/config/config.js`:

```javascript
export const config = {
  // WAL file path
  WAL_FILE: path.join(DATA_DIR, "wal.log"),
  
  // ROM snapshot file
  ROM_FILE: path.join(DATA_DIR, "db.json"),
  
  // WAL sync mode: 'sync' (safer) or 'async' (faster)
  WAL_SYNC_MODE: "sync",
  
  // Checkpoint interval (operations before WAL truncation)
  CHECKPOINT_INTERVAL: 1000,
  
  // Data directory
  DATA_DIR: path.join(__dirname, "..", "data")
};
```

### Sync Modes

| Mode | Durability | Performance | Use Case |
|------|-----------|-------------|----------|
| `sync` | ✅ High (fsync) | ⚡ Slower | Production |
| `async` | ⚠️ OS-buffered | 🚀 Faster | Development |

---

## 🧪 Testing Crash Recovery

### Manual Test

```bash
# 1. Start server
npm run dev

# 2. Add data
curl -X POST http://localhost:4000/api/kv/test \
  -H "Content-Type: application/json" \
  -d '{"value": "crash-test"}'

# 3. Kill server (Ctrl+C)

# 4. Restart server
npm run dev

# 5. Verify data persists
curl http://localhost:4000/api/kv/test
```

### Queue Recovery Test

```bash
# 1. Enqueue items
curl -X POST http://localhost:4000/api/queue/myQueue/enqueue \
  -H "Content-Type: application/json" \
  -d '{"value": "item1"}'

# 2. Kill server

# 3. Restart and verify
curl http://localhost:4000/api/queue/myQueue/size
```

---

## 🎯 Why This Project?

This project demonstrates **production-grade storage concepts** used in:

### Real-World Systems
- **PostgreSQL**: WAL for crash recovery
- **Redis**: In-memory + persistence
- **Kafka**: Append-only logs
- **RocksDB**: LSM-tree architecture

### Core Principles
- ✅ **Durability**: Data survives crashes
- ✅ **Atomicity**: All-or-nothing operations
- ✅ **Consistency**: Valid state after recovery
- ✅ **Performance**: In-memory reads, sequential writes

---

## 🔮 Future Improvements

### Storage Engine
- [ ] WAL compaction and rotation
- [ ] Snapshots with incremental backups
- [ ] LSM-tree with SSTables
- [ ] Bloom filters for faster lookups
- [ ] Compression (Snappy/LZ4)

### Distributed Systems
- [ ] Multi-node replication
- [ ] Raft consensus protocol
- [ ] Leader-follower architecture
- [ ] Sharding and partitioning

### Observability
- [ ] Prometheus metrics
- [ ] Grafana dashboards
- [ ] Structured logging
- [ ] Health checks and readiness probes

### Advanced Features
- [ ] Transactions (ACID)
- [ ] Secondary indexes
- [ ] TTL (Time-To-Live) support
- [ ] Pub/Sub messaging

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Storage**: In-memory + File System
- **Persistence**: WAL + ROM (JSON)

### Frontend
- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui, Radix UI
- **Icons**: Lucide React
- **Notifications**: Sonner

### DevOps
- **Containerization**: Docker, Docker Compose
- **Development**: Nodemon (hot reload)

---

## 📌 Keywords

`key-value-store` `write-ahead-log` `storage-engine` `crash-recovery` `distributed-systems` `nodejs` `express` `nextjs` `typescript` `docker` `persistence` `database-internals` `fifo-queue` `rom-persistence` `wal-recovery`

---

## 📄 License

MIT License

---

## 👨‍💻 Author

**Nikhil Anand**  
GitHub: [@niks-nikhil-anand](https://github.com/niks-nikhil-anand)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
