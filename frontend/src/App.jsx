import { useEffect, useState } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    fetch(`${apiBase}/todos`)
      .then((response) => response.json())
      .then((data) => {
        setTodos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [apiBase]);

  const handleAdd = async () => {
    if (!text.trim()) return;
    const response = await fetch(`${apiBase}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const newTodo = await response.json();
    setTodos((current) => [...current, newTodo]);
    setText('');
  };

  const handleDelete = async (id) => {
    await fetch(`${apiBase}/todos/${id}`, { method: 'DELETE' });
    setTodos((current) => current.filter((todo) => todo.id !== id));
  };

  return (
    <div className="app-shell">
      <h1>Todo App</h1>
      <div className="todo-form">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New task"
        />
        <button onClick={handleAdd}>Add</button>
      </div>
      {loading ? (
        <p>Loading tasks...</p>
      ) : todos.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id}>
              <span>{todo.text}</span>
              <button onClick={() => handleDelete(todo.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
