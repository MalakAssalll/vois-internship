const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
const mysql = require('mysql2/promise');

// 1. MIDDLEWARE
// Enable CORS for the frontend dev server
app.use(cors({ origin: 'http://localhost:5000' }));
// Parse incoming JSON request bodies (e.g., when adding a new task)
app.use(express.json());


const pool = mysql.createPool({
    host: process.env.DB_HOST || 'mysql-db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'todos',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


async function initDb() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS todos (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                text VARCHAR(255) NOT NULL
            )
        `);
        console.log('Database table initialized.');
    } catch (err) {
        console.error('Error initializing database table:', err);
    }
}

initDb();

// 3. REST API ROUTES

// Register User
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, password]
        );
        res.status(201).json({
            message: 'User registered successfully!',
            user: { id: result.insertId, username, email }
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

// Login User
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await pool.query(
            'SELECT id, username, password, email FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = users[0];

        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.json({
            message: 'Login successful!',
            user: { id: user.id, username: user.username, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Route A: Fetch to-dos for a specific user
app.get('/api/todos', async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ error: 'userId query parameter is required' });
    }

    try {
        const [rows] = await pool.query('SELECT * FROM todos WHERE user_id = ?', [userId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route B: Add a new to-do item for a specific user
app.post('/api/todos', async (req, res) => {
    const { text, userId } = req.body;
    if (!text || !userId) {
        return res.status(400).json({ error: 'text and userId are required' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO todos (text, user_id) VALUES (?, ?)',
            [text, userId]
        );

        const newTodo = {
            id: result.insertId,
            text: text,
            user_id: userId
        };
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route C: Delete a to-do item by ID
app.delete('/api/todos/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        await pool.query('DELETE FROM todos WHERE id = ?', [id]);
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 4. START THE SERVER
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});