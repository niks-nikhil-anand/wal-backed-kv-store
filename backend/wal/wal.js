import fs from "fs";
import path from "path";
import { config } from "../config/config.js";

// Ensure data directory exists
const ensureDataDir = () => {
    if (!fs.existsSync(config.DATA_DIR)) {
        fs.mkdirSync(config.DATA_DIR, { recursive: true });
    }
};

/**
 * Write an entry to the Write-Ahead Log
 * @param {Object} entry - The log entry to write
 * @param {string} entry.id - Unique identifier for the operation
 * @param {string} entry.type - Operation type (QUEUE_ENQUEUE, QUEUE_DEQUEUE, etc.)
 * @param {string} entry.queue - Queue name
 * @param {*} entry.value - Value being operated on
 * @param {string} entry.status - Operation status (STARTED)
 */
export function writeWAL(entry) {
    ensureDataDir();

    // Add timestamp to entry
    const logEntry = {
        ...entry,
        timestamp: Date.now(),
    };

    // Append to WAL file
    const logLine = JSON.stringify(logEntry) + "\n";

    if (config.WAL_SYNC_MODE === "sync") {
        // Synchronous write with fsync for durability
        const fd = fs.openSync(config.WAL_FILE, "a");
        fs.writeSync(fd, logLine);
        fs.fsyncSync(fd);
        fs.closeSync(fd);
    } else {
        // Asynchronous write (faster but less durable)
        fs.appendFileSync(config.WAL_FILE, logLine);
    }
}

/**
 * Write a COMMIT entry to the WAL
 * This marks an operation as successfully completed
 * @param {string} id - The operation ID to commit
 */
export function commitWAL(id) {
    writeWAL({
        type: "COMMIT",
        id,
    });
}

/**
 * Read all entries from the WAL
 * @returns {Array} Array of log entries
 */
export function readWAL() {
    ensureDataDir();

    if (!fs.existsSync(config.WAL_FILE)) {
        return [];
    }

    const content = fs.readFileSync(config.WAL_FILE, "utf-8");
    const lines = content.split("\n").filter((line) => line.trim());

    return lines.map((line) => {
        try {
            return JSON.parse(line);
        } catch (error) {
            console.error("Failed to parse WAL entry:", line, error);
            return null;
        }
    }).filter(Boolean);
}

/**
 * Clear the WAL file
 * This should only be called after a successful checkpoint (ROM sync)
 */
export function clearWAL() {
    ensureDataDir();

    if (fs.existsSync(config.WAL_FILE)) {
        fs.writeFileSync(config.WAL_FILE, "");
    }
}

/**
 * Get the number of operations in the WAL
 * @returns {number} Number of operations (excluding COMMIT entries)
 */
export function getWALOperationCount() {
    const entries = readWAL();
    return entries.filter((entry) => entry.type !== "COMMIT").length;
}
