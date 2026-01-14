import express from "express";
import {
    enqueue,
    dequeue,
    peek,
    size,
    list,
    clearQueue,
} from "../queue/queue.js";

const router = express.Router();

/**
 * POST /api/queue/:queueName/enqueue
 * Add an item to a queue
 */
router.post("/:queueName/enqueue", (req, res) => {
    try {
        const { queueName } = req.params;
        const { value } = req.body;

        if (value === undefined) {
            return res.status(400).json({
                success: false,
                error: "Value is required",
            });
        }

        const result = enqueue(queueName, value);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

/**
 * POST /api/queue/:queueName/dequeue
 * Remove and return the first item from a queue
 */
router.post("/:queueName/dequeue", (req, res) => {
    try {
        const { queueName } = req.params;
        const value = dequeue(queueName);

        if (value === null) {
            return res.status(404).json({
                success: false,
                error: "Queue is empty or does not exist",
            });
        }

        res.status(200).json({
            success: true,
            queue: queueName,
            value,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

/**
 * GET /api/queue/:queueName/peek
 * View the first item in a queue without removing it
 */
router.get("/:queueName/peek", (req, res) => {
    try {
        const { queueName } = req.params;
        const value = peek(queueName);

        if (value === null) {
            return res.status(404).json({
                success: false,
                error: "Queue is empty or does not exist",
            });
        }

        res.status(200).json({
            success: true,
            queue: queueName,
            value,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

/**
 * GET /api/queue/:queueName/size
 * Get the number of items in a queue
 */
router.get("/:queueName/size", (req, res) => {
    try {
        const { queueName } = req.params;
        const queueSize = size(queueName);

        res.status(200).json({
            success: true,
            queue: queueName,
            size: queueSize,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

/**
 * DELETE /api/queue/:queueName
 * Clear all items from a queue
 */
router.delete("/:queueName", (req, res) => {
    try {
        const { queueName } = req.params;
        const result = clearQueue(queueName);

        if (!result.success) {
            return res.status(404).json(result);
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

/**
 * GET /api/queue
 * List all queue names
 */
router.get("/", (req, res) => {
    try {
        const queues = list();

        res.status(200).json({
            success: true,
            queues,
            count: queues.length,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

export default router;
