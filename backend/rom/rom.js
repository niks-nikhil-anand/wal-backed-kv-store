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
 * Save the entire database state to disk (ROM)
 * Uses atomic write pattern: write to temp file, then rename
 * @param {Object} data - The database state to persist
 */
export function saveToROM(data) {
    ensureDataDir();

    const tempFile = config.ROM_FILE + ".tmp";

    try {
        // Write to temporary file first
        fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");

        // Atomic rename (this is crash-safe on most filesystems)
        fs.renameSync(tempFile, config.ROM_FILE);
    } catch (error) {
        // Clean up temp file if it exists
        if (fs.existsSync(tempFile)) {
            fs.unlinkSync(tempFile);
        }
        throw new Error(`Failed to save to ROM: ${error.message}`);
    }
}

/**
 * Load the database state from disk (ROM)
 * @returns {Object} The persisted database state, or empty object if file doesn't exist
 */
export function loadFromROM() {
    ensureDataDir();

    if (!fs.existsSync(config.ROM_FILE)) {
        return { queues: {} };
    }

    try {
        const content = fs.readFileSync(config.ROM_FILE, "utf-8");
        const data = JSON.parse(content);

        // Ensure queues property exists
        if (!data.queues) {
            data.queues = {};
        }

        return data;
    } catch (error) {
        console.error("Failed to load from ROM, returning empty state:", error.message);
        return { queues: {} };
    }
}

/**
 * Check if ROM file exists
 * @returns {boolean} True if ROM file exists
 */
export function romExists() {
    return fs.existsSync(config.ROM_FILE);
}
