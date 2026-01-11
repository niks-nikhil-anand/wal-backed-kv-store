import express from 'express';
import cors from 'cors';
import kvRouter from './routes/kv.routes.js';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());



app.get('/test', (req, res) => {
    res.json({ message: 'Test API works!' });
});

// KV API routes
app.use('/api/kv', kvRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
