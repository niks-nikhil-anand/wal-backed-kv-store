// Simple in-memory key-value store
// This will not persist data across server restarts
// It stores data in a JavaScript object
// It store data in the RAM of the server

export const db = {}

// set a key-value pair
export const set = (key, value) => {
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

    delete db[key];
    return true;
}


// check if a key exists

export const has = (key) => {
    return db[key] !== undefined;
}


// Get all key-value pairs

export const all = () =>{
    return Object.entries(db);
}


// Clear all key-value pairs

export const clear = () => {
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