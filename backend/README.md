# Timetable App Backend

This is a simple Node.js/Express backend with PostgreSQL for the Timetable App.

## Setup

1. Install dependencies:
   ```sh
   cd backend
   npm install
   ```
2. Create a `.env` file in the `backend` folder with your PostgreSQL connection string:
   ```env
   DATABASE_URL=postgres://username:password@localhost:5432/your_db_name
   PORT=4000
   ```
3. Create the required tables in your PostgreSQL database:
   ```sql
   CREATE TABLE timetables (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255) NOT NULL
   );

   CREATE TABLE attendance (
     id SERIAL PRIMARY KEY,
     timetable_id INTEGER REFERENCES timetables(id),
     date DATE NOT NULL,
     present BOOLEAN NOT NULL
   );
   ```
4. Start the backend server:
   ```sh
   npm run dev
   ```

## API Endpoints
- `GET /api/timetables` — List all timetables
- `GET /api/attendance` — List all attendance records

You can expand this backend with more routes as needed.
