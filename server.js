const express = require('express');
const app = express();
const PORT = 3000;

// 1. MIDDLEWARE
// Parse incoming JSON request bodies (e.g., when adding a new task)
app.use(express.json());

// Serve static frontend files automatically from the /public folder
app.use(express.static('public'));


// 2. IN-MEMORY DATA STORAGE
// A simple array of objects representing our tasks in RAM
let todos = [
    { id: 1, text: 'Complete Node.js setup' },
    { id: 2, text: 'Test backend REST endpoints' }
];


// 3. REST API ROUTES

// Route A: Fetch all to-do items
app.get('/api/todos', (req, res) => {
    res.json(todos);
});

// Route B: Add a new to-do item
app.post('/api/todos', (req, res) => {
    const newTodo = {
        id: Date.now(), // Unique ID using current timestamp
        text: req.body.text
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// Route C: Delete a to-do item by ID
app.delete('/api/todos/:id', (req, res) => {
    const id = Number(req.params.id);
    todos = todos.filter(todo => todo.id !== id);
    res.json({ message: 'Task deleted successfully' });
});


// 4. START THE SERVER
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});