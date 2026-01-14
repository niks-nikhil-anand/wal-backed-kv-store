// Simple in-memory key-value store with Write-Ahead Log (WAL)
// WAL ensures durability by logging operations before executing them
// This allows recovery of data in case of crashes
// It stores data in a JavaScript object in RAM

import fs from "fs";

const WAL_FILE = "./wal.log";

// Helper function to write operations to WAL
function writeWAL(op) {
    fs.appendFileSync(WAL_FILE, JSON.stringify(op) + "\n");
}

export const db = {}

// set a key-value pair
export const set = (key, value) => {
    writeWAL({ type: "SET", key, value });
    db[key] = value;
    return { key, value };
}

// get the value for a key

export const get = (key) => {
    return db[key];
}

// delete a key

export const deleteKey = (key) => {
    // Check if key exists
    if (db[key] === undefined) return false;

    writeWAL({ type: "DELETE", key });
    delete db[key];
    return true;
}


// check if a key exists

export const has = (key) => {
    return db[key] !== undefined;
}


// Get all key-value pairs

export const all = () => {
    return Object.entries(db);
}


// Clear all key-value pairs

export const clear = () => {
    writeWAL({ type: "CLEAR" });
    Object.keys(db).forEach((k) => delete db[k]);
}

export default {
    set,
    get,
    deleteKey,
    has,
    all,
    clear
}