import { useEffect, useState } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);


 const [isRegistering, setIsRegistering] = useState(false);
 const [username, setUsername] = useState('');



 const [user, setUser] = useState(null); // Stores logged-in user details { id, username }
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';


  // Handle Register Submit
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiBase}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await response.json();

      if (response.ok) {
        alert('Registration successful! Please log in.');
        setIsRegistering(false); // Switch to Login mode
      } else {
        alert(`Registration failed: ${data.error}`);
      }
    } catch (err) {
      alert('Error connecting to backend');
    }
  };


  // --- 1. CHECK IF USER IS ALREADY LOGGED IN ON LOAD ---
  useEffect(() => {
    const savedUserId = localStorage.getItem('userId');
    const savedUsername = localStorage.getItem('username');

    if (savedUserId && savedUsername) {
      setUser({ id: savedUserId, username: savedUsername });
      fetchUserTodos(savedUserId);
    }
  }, []);

  // --- 2. FETCH TODOS FOR LOGGED-IN USER ---
  const fetchUserTodos = (userId) => {
    setLoading(true);
    fetch(`${apiBase}/todos?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setTodos(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // --- 3. HANDLE LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents page reload

    try {
      const response = await fetch(`${apiBase}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Save user details to localStorage
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('username', data.user.username);

        // Update React state
        setUser({ id: data.user.id, username: data.user.username });
        alert(`Welcome back, ${data.user.username}!`);

        // Fetch personal todos
        fetchUserTodos(data.user.id);
      } else {
        alert(`Login failed: ${data.error}`);
      }
    } catch (err) {
      alert('Error connecting to backend server');
    }
  };

  // --- 4. HANDLE LOGOUT ---
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setUser(null);
    setTodos([]);
    setEmail('');
    setPassword('');
  };

  // --- 5. HANDLE ADD TODO ---
  const handleAdd = async () => {
    if (!text.trim() || !user) return;

    const response = await fetch(`${apiBase}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, userId: user.id })
    });

    const newTodo = await response.json();
    setTodos((current) => [...current, newTodo]);
    setText('');
  };

  // --- 6. HANDLE DELETE TODO ---
  const handleDelete = async (id) => {
    await fetch(`${apiBase}/todos/${id}`, { method: 'DELETE' });
    setTodos((current) => current.filter((todo) => todo.id !== id));
  };

  // --- RENDER SCREEN ---
  // SCREEN A: IF NOT LOGGED IN -> SHOW LOGIN OR REGISTER FORM
    if (!user) {
      return (
        <div className="app-shell">
          <h1>{isRegistering ? 'Register Account' : 'Login'}</h1>

          <form 
            className="login-form" 
            onSubmit={isRegistering ? handleRegister : handleLogin}
          >
            {isRegistering && (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
            )}

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />

            <button type="submit">
              {isRegistering ? 'Register' : 'Login'}
            </button>
          </form>

          <p style={{ marginTop: '1rem', textAlign: 'center' }}>
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              style={{
                background: 'none',
                border: 'none',
                color: '#007bff',
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
            >
              {isRegistering ? 'Login here' : 'Register here'}
            </button>
          </p>
        </div>
      );
    }

    // SCREEN B: IF LOGGED IN -> SHOW USER'S TODOS
    return (
      <div className="app-shell">
        <div 
          className="header-bar" 
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <h2>Welcome, {user.username}!</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>

        <div className="todo-form">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="New task"
          />
          <button onClick={handleAdd}>Add Task</button>
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
