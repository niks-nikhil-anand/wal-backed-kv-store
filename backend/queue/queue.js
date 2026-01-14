import crypto from "crypto";
import { db } from "../store/memory.store.js";
import { writeWAL, commitWAL } from "../wal/wal.js";
import { saveToROM } from "../rom/rom.js";

/**
 * Add an item to the end of a queue (FIFO)
 * Follows WAL ordering: WAL → RAM → ROM → Commit
 * @param {string} queueName - Name of the queue
 * @param {*} value - Value to enqueue
 * @returns {Object} Operation result
 */
export function enqueue(queueName, value) {
    const id = crypto.randomUUID();

    // 1️⃣ Write intent to WAL (STARTED status)
    writeWAL({
        id,
        type: "QUEUE_ENQUEUE",
        queue: queueName,
        value,
        status: "STARTED",
    });

    // 2️⃣ Update RAM (in-memory database)
    if (!db.queues[queueName]) {
        db.queues[queueName] = [];
    }
    db.queues[queueName].push(value);

    // 3️⃣ Persist to ROM (disk)
    saveToROM(db);

    // 4️⃣ Confirm commit in WAL
    commitWAL(id);

    return {
        success: true,
        queue: queueName,
        value,
        size: db.queues[queueName].length,
    };
}

/**
 * Remove and return the first item from a queue (FIFO)
 * Follows WAL ordering: WAL → RAM → ROM → Commit
 * @param {string} queueName - Name of the queue
 * @returns {*} The dequeued value, or null if queue is empty
 */
export function dequeue(queueName) {
    // Check if queue exists and has items
    if (!db.queues[queueName] || db.queues[queueName].length === 0) {
        return null;
    }

    const id = crypto.randomUUID();
    const value = db.queues[queueName][0]; // Peek at first item

    // 1️⃣ Write intent to WAL (STARTED status)
    writeWAL({
        id,
        type: "QUEUE_DEQUEUE",
        queue: queueName,
        value,
        status: "STARTED",
    });

    // 2️⃣ Update RAM (remove from queue)
    db.queues[queueName].shift();

    // 3️⃣ Persist to ROM (disk)
    saveToROM(db);

    // 4️⃣ Confirm commit in WAL
    commitWAL(id);

    return value;
}

/**
 * View the first item in a queue without removing it
 * This is a read-only operation, no WAL needed
 * @param {string} queueName - Name of the queue
 * @returns {*} The first value, or null if queue is empty
 */
export function peek(queueName) {
    if (!db.queues[queueName] || db.queues[queueName].length === 0) {
        return null;
    }

    return db.queues[queueName][0];
}

/**
 * Get the number of items in a queue
 * This is a read-only operation, no WAL needed
 * @param {string} queueName - Name of the queue
 * @returns {number} Queue size
 */
export function size(queueName) {
    if (!db.queues[queueName]) {
        return 0;
    }

    return db.queues[queueName].length;
}

/**
 * List all queue names
 * This is a read-only operation, no WAL needed
 * @returns {Array<string>} Array of queue names
 */
export function list() {
    return Object.keys(db.queues);
}

/**
 * Clear all items from a queue
 * Follows WAL ordering: WAL → RAM → ROM → Commit
 * @param {string} queueName - Name of the queue
 * @returns {Object} Operation result
 */
export function clearQueue(queueName) {
    if (!db.queues[queueName]) {
        return { success: false, message: "Queue does not exist" };
    }

    const id = crypto.randomUUID();

    // 1️⃣ Write intent to WAL (STARTED status)
    writeWAL({
        id,
        type: "QUEUE_CLEAR",
        queue: queueName,
        status: "STARTED",
    });

    // 2️⃣ Update RAM (clear queue)
    db.queues[queueName] = [];

    // 3️⃣ Persist to ROM (disk)
    saveToROM(db);

    // 4️⃣ Confirm commit in WAL
    commitWAL(id);

    return {
        success: true,
        queue: queueName,
    };
}

export default {
    enqueue,
    dequeue,
    peek,
    size,
    list,
    clearQueue,
};
