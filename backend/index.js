import express from 'express';
import dotenv from 'dotenv';
import { Pool } from 'pg';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());

// Example route: Health check
app.get('/', (req, res) => {
  res.send('Timetable backend is running!');
});

// Example route: Get all timetables
app.get('/api/timetables', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM timetables');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Example route: Get all attendance records
app.get('/api/attendance', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM attendance');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
