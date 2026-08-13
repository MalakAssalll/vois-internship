// 1. SELECT HTML ELEMENTS
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

// 2. FETCH AND DISPLAY ALL TASKS WHEN PAGE LOADS
async function loadTodos() {
    // Send a GET request to our REST API endpoint in server.js
    const response = await fetch('/api/todos');
    const todos = await response.json();

    // Clear existing list items in the DOM
    todoList.innerHTML = '';

    // Loop through each task and render it on the screen
    todos.forEach(todo => {
        renderTodo(todo);
    });
}

// 3. RENDER A SINGLE TASK ROW IN HTML
function renderTodo(todo) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    
    li.innerHTML = `
        <span>${todo.text}</span>
        <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
    `;

    todoList.appendChild(li);
}

// 4. ADD A NEW TASK (POST REQUEST)
addBtn.addEventListener('click', async () => {
    const text = todoInput.value.trim();
    if (!text) return; // Don't allow empty tasks

    // Send a POST request with the new task text in JSON body
    const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text })
    });

    const newTodo = await response.json();

    // Display the new task on the screen and clear input box
    renderTodo(newTodo);
    todoInput.value = '';
});

// 5. DELETE A TASK (DELETE REQUEST)
async function deleteTodo(id) {
    // Send a DELETE request to our REST API with the specific ID
    await fetch(`/api/todos/${id}`, {
        method: 'DELETE'
    });

    // Reload the task list to reflect deletion
    loadTodos();
}

// Initial load when user opens the page
loadTodos();