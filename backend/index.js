const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// In-memory KV store
const db = {};

app.get('/test', (req, res) => {
    res.json({ message: 'Test API works!' });
});

// Set a key-value pair
app.post('/set', (req, res) => {
    const { key, value } = req.body;
    if (!key || value === undefined) {
        return res.status(400).json({ error: 'Key and value are required' });
    }
    db[key] = value;
    console.log(`SET: ${key} = ${JSON.stringify(value)}`);
    res.json({ message: 'Key set successfully', key, value });
});

// Get a value by key
app.get('/get/:key', (req, res) => {
    const { key } = req.params;
    const value = db[key];
    if (value === undefined) {
        return res.status(404).json({ error: 'Key not found' });
    }
    console.log(`GET: ${key} = ${JSON.stringify(value)}`);
    res.json({ key, value });
});

// Get all keys (for debugging/display)
app.get('/all', (req, res) => {
    res.json(db);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
