import express from 'express';
import cors from 'cors';
import kvRouter from './routes/kv.routes.js';
import queueRouter from './routes/queue.routes.js';
import { recoverFromWAL } from './wal/recover.js';
import { loadFromROM } from './rom/rom.js';
import { db } from './store/memory.store.js';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// 🔄 RECOVERY PHASE: Run before starting server
console.log('=== Starting WAL-Backed KV Store ===');

// Load persisted state from ROM (if exists)
const romData = loadFromROM();
if (romData.queues) {
    Object.assign(db.queues, romData.queues);
    console.log('📦 Loaded state from ROM');
}

// Recover from WAL (replay uncommitted operations)
recoverFromWAL();

console.log('=== Recovery Complete ===\n');

// Test endpoint
app.get('/test', (req, res) => {
    res.json({ message: 'Test API works!' });
});

// KV API routes
app.use('/api/kv', kvRouter);

// Queue API routes
app.use('/api/queue', queueRouter);

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📊 Key-Value API: http://localhost:${PORT}/api/kv`);
    console.log(`📋 Queue API: http://localhost:${PORT}/api/queue`);
});

