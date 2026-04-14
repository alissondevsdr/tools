import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeSchema } from './database/connection.js';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize Database
initializeSchema();

// Routes
app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
