import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data directory for persistence files
const DATA_DIR = path.join(__dirname, "..", "data");

export const config = {
    // WAL (Write-Ahead Log) configuration
    WAL_FILE: path.join(DATA_DIR, "wal.log"),

    // ROM (Disk persistence) configuration
    ROM_FILE: path.join(DATA_DIR, "db.json"),

    // WAL sync mode: 'sync' for fsync after each write, 'async' for OS buffering
    // 'sync' is safer but slower, 'async' is faster but may lose data on crash
    WAL_SYNC_MODE: "sync",

    // Checkpoint interval: truncate WAL after this many operations
    // Higher values = better performance, lower values = smaller WAL file
    CHECKPOINT_INTERVAL: 1000,

    // Data directory path
    DATA_DIR,
};
