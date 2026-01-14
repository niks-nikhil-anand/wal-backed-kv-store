import { readWAL } from "../wal/wal.js";
import { db } from "../store/memory.store.js";
import { saveToROM } from "../rom/rom.js";

/**
 * Recover database state from WAL after a crash
 * This function replays all uncommitted operations from the WAL
 * 
 * Recovery logic:
 * 1. Read all WAL entries
 * 2. Track operations with STARTED status
 * 3. Remove operations that have matching COMMIT entries
 * 4. Replay remaining uncommitted operations
 */
export function recoverFromWAL() {
    console.log("🔄 Starting WAL recovery...");

    const entries = readWAL();

    if (entries.length === 0) {
        console.log("✅ No WAL entries found, starting fresh");
        return;
    }

    // Map to track pending (uncommitted) operations
    const pending = new Map();

    // Process all WAL entries
    for (const entry of entries) {
        if (entry.status === "STARTED") {
            // Track operation as pending
            pending.set(entry.id, entry);
        } else if (entry.type === "COMMIT") {
            // Remove committed operation from pending
            pending.delete(entry.id);
        }
    }

    // Replay uncommitted operations
    if (pending.size > 0) {
        console.log(`⚠️  Found ${pending.size} uncommitted operations, replaying...`);

        for (const entry of pending.values()) {
            replayOperation(entry);
        }

        // Save recovered state to ROM
        saveToROM(db);
        console.log("✅ Recovery complete, state saved to ROM");
    } else {
        console.log("✅ All operations committed, no recovery needed");
    }
}

/**
 * Replay a single operation from the WAL
 * @param {Object} entry - WAL entry to replay
 */
function replayOperation(entry) {
    try {
        switch (entry.type) {
            case "QUEUE_ENQUEUE":
                // Replay enqueue operation
                if (!db.queues[entry.queue]) {
                    db.queues[entry.queue] = [];
                }
                db.queues[entry.queue].push(entry.value);
                console.log(`  ↻ Replayed ENQUEUE: ${entry.queue}`);
                break;

            case "QUEUE_DEQUEUE":
                // Replay dequeue operation
                if (db.queues[entry.queue] && db.queues[entry.queue].length > 0) {
                    db.queues[entry.queue].shift();
                    console.log(`  ↻ Replayed DEQUEUE: ${entry.queue}`);
                }
                break;

            case "QUEUE_CLEAR":
                // Replay clear operation
                if (db.queues[entry.queue]) {
                    db.queues[entry.queue] = [];
                    console.log(`  ↻ Replayed CLEAR: ${entry.queue}`);
                }
                break;

            case "SET":
                // Replay key-value SET operation (for existing KV store)
                db[entry.key] = entry.value;
                console.log(`  ↻ Replayed SET: ${entry.key}`);
                break;

            case "DELETE":
                // Replay key-value DELETE operation (for existing KV store)
                delete db[entry.key];
                console.log(`  ↻ Replayed DELETE: ${entry.key}`);
                break;

            case "CLEAR":
                // Replay key-value CLEAR operation (for existing KV store)
                Object.keys(db).forEach((key) => {
                    if (key !== "queues") {
                        delete db[key];
                    }
                });
                console.log(`  ↻ Replayed CLEAR`);
                break;

            default:
                console.warn(`  ⚠️  Unknown operation type: ${entry.type}`);
        }
    } catch (error) {
        console.error(`  ❌ Failed to replay operation:`, entry, error);
    }
}

export default {
    recoverFromWAL,
};
