import * as store from '../store/memory.store.js';


// Save the key and value
export const setKey = (req, res) => {
  const { key, value } = req.body;
  if (!key || value === undefined) {
    return res.status(400).json({ error: 'Key and value are required' });
  }
  console.log(key)
  console.log(value)

  const result = store.set(key, value);
  console.log(result)
  console.log(`SET: ${key} = ${JSON.stringify(value)}`);
  res.status(201).json({ message: 'Key set successfully', ...result });
};
// Retrieve the value for a given key
export const getKey = (req, res) => {
  const { key } = req.params;
  const value = store.get(key);
  if (value === undefined) {
    return res.status(404).json({ error: 'Key not found' });
  }
  console.log(`GET: ${key} = ${JSON.stringify(value)}`);
  res.json({ key, value });
};

// Update the value for a given key
export const updateKey = (req, res) => {
  const { key } = req.params;
  const { value } = req.body;

  if (value === undefined) {
    return res.status(400).json({ error: 'Value is required for update' });
  }

  if (!store.has(key)) {
    return res.status(404).json({ error: 'Key not found' });
  }

  store.set(key, value);
  console.log(`UPDATE: ${key} = ${JSON.stringify(value)}`);
  res.json({ message: 'Key updated successfully', key, value });
};


// Delete a key
export const deleteKey = (req, res) => {
  const { key } = req.params;
  const ok = store.deleteKey(key);
  if (!ok) {
    return res.status(404).json({ error: 'Key not found' });
  }
  console.log(`DELETE: ${key}`);
  res.json({ message: 'Key deleted successfully', key });
};

export const getAll = (req, res) => {
  res.json(store.all());
};
