import express from 'express';

const router = express.Router();
import * as controller from '../controllers/kv.controller.js';

// Create / Set a key
router.post('/', controller.setKey);

// Read: get a key
router.get('/:key', controller.getKey);

// Update a key
router.put('/:key', controller.updateKey);


// Alternatively support PATCH
router.patch('/:key', controller.updateKey);

// Delete a key
router.delete('/:key', controller.deleteKey);

// Get all keys
router.get('/', controller.getAll);

export default router;
