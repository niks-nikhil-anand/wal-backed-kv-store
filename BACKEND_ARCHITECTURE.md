# Backend Architecture & Engineering Roadmap

## 1. System Overview

The current system acts as a durable, in-memory **Key-Value Store** and **Message Queue**. It prioritizes data safety through a Write-Ahead Log (WAL) and simple snapshotting (ROM).

### High-Level Architecture
```mermaid
graph TD
    Client[Client / API] --> Router[Express Router]
    Router --> Controller[Controller Layer]
    Controller --> WAL[Write-Ahead Log (Disk)]
    WAL -- fsync --> Disk1[wal.log]
    Controller --> Memory[In-Memory Store (RAM)]
    Memory --> ROM[ROM / Snapshot (Disk)]
    ROM --> Disk2[db.json]
    
    subgraph Persistence Layer
    Disk1
    Disk2
    end
```

### Core Components

#### 1. In-Memory Store (`store/memory.store.js`)
- **Data Structure**: Native JavaScript Object (`{}`).
- **Performance**: O(1) for GET/SET operations.
- **Limitation**: Bound by the V8 Heap limit (typically ~1.4GB - 4GB depending on Node version flags).

#### 2. Write-Ahead Log (WAL) (`wal/wal.js`)
- **Purpose**: Durability. No write is considered "complete" until it is appended to the WAL.
- **Sync Mode**: Currently configured to `sync` (in `config.js`). 
  - Uses `fs.fsyncSync` to force OS buffers to flush to physical disk.
  - **Trade-off**: High durability, lower write throughput (latency = disk seek time).
- **Recovery**: On startup, the system replays the WAL to restore state.

#### 3. ROM (Read-Only Memory / Snapshots) (`rom/rom.js`)
- **Purpose**: Fast startup and log truncation.
- **Mechanism**: Serializes the *entire* `db` object to JSON and writes it to disk.
- **Atomic Writes**: Uses `write` -> `rename` pattern to ensure files are never corrupted during a crash.

#### 4. Queue System (`queue/queue.js`)
- **Structure**: Arrays stored within the main `db` object.
- **Critical Flaw**: Every `enqueue` or `dequeue` operation triggers a **full ROM save**.
  - **Complexity**: O(N) where N is the total database size.
  - **Impact**: As the DB grows to 100MB, every queue item add/remove will pause the server to write 100MB to disk.

---

## 2. Implementation Analysis

| Feature | Implementation Details | Rating |
| :--- | :--- | :--- |
| **Durability** | WAL with `fsync`. Very robust against power loss. | ⭐⭐⭐⭐⭐ |
| **Read Speed** | In-memory lookup. Near instantaneous. | ⭐⭐⭐⭐⭐ |
| **Write Speed (KV)** | Bound by disk append speed. Acceptable. | ⭐⭐⭐ |
| **Write Speed (Queue)** | **Blocking O(N) disk dump.** Unscalable. | ⭐ |
| **Concurrency** | Single-threaded Event Loop. Safe but limits CPU utilization. | ⭐⭐ |
| **Scalability** | Single Node only. Vertical scaling constrained by RAM. | ⭐ |

---

## 3. Roadmap to "FAANG Scale"

To transition from a toy project to a distributed, production-grade system (like DynamoDB, Cassandra, or Kafka), the following phases are required.

### Phase 1: Storage Engine Optimization (LSM Trees)
*Goal: Remove the RAM limit and fix write blocking.*
- **Replace JSON Dump with LSM Trees**: Implement a Log-Structured Merge Tree architecture.
  - **MemTable**: Writes go to an in-memory balanced tree (Red-Black Tree or Skip List).
  - **SSTables**: When MemTable fills (e.g., 64MB), flush to disk as an immutable Sorted String Table (SSTable).
  - **Compaction**: Background process merges old SSTables to reclaim space and remove deleted keys.
- **Block Cache**: Cache frequently accessed disk blocks in memory (LRU Cache).

### Phase 2: Horizontal Scalability (Sharding)
*Goal: Distribute data across many servers.*
- **Consistent Hashing**: Use a hash ring (e.g., modulo $2^{64}$) to map keys to nodes.
- **Virtual Nodes (VNodes)**: Assign multiple points on the ring to each physical node to ensure even load distribution even if nodes have different capacities.
- **Gossip Protocol**: Nodes communicate peer-to-peer to discover cluster membership and detect failures.

### Phase 3: High Availability (Replication & Consensus)
*Goal: Zero downtime even if servers burn down.*
- **Replication**: Configurable replication factor (e.g., $N=3$).
- **Leader Election (Raft/Paxos)**: For each shard, elect a Leader to handle writes and Followers to replicate.
- **Tunable Consistency**: Allow clients to choose:
  - `Consistency`: Read from Leader (slower, always latest).
  - `Availability`: Read from any Follower (faster, eventually consistent).

### Phase 4: Network & Reliability
- **Load Balancer**: A scalable L7 proxy (Nginx/Envoy) to route client requests to the correct node.
- **Rate Limiting**: Token Bucket algorithm to prevent abusive clients from crashing the cluster.
- **Failure Detection**: Phi Accrual Failure Detector to intelligently distinguish between network blips and dead nodes.
