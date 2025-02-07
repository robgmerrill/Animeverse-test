import React, { useState } from 'react';
import '../LoginForm.css';

interface User {
  id: string; // Or however your user is identified
  name: string;
  // ... other user properties
}

interface LoginFormProps {
  onLogin: (user: User) => void;
}

interface User {
  // Make sure this matches the User interface in App.tsx
  id: string;
  name: string;
  // ... other user properties
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any previous errors
    setIsLoading(true);

    try {
      const response = await fetch('https://api.jikan.moe/v4/anime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Try to get error details from the API
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const userData: User = await response.json(); // Assuming your API returns user data
      onLogin(userData);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message); // Set the error message for display
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'grid', cursor: 'pointer' }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}{' '}
      {/* Display error message */}
      <h1 className="welcome">Welcome! Please Sign Up or Login!</h1>
      <label htmlFor="username">Username:</label>
      <br />
      <input
        className="username"
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required // Make username required
      />
      <br />
      <label htmlFor="password">Password:</label>
      <br />
      <input
        className="password"
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required // Make password required
      />
      <br />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'} {/* Show loading state */}
      </button>
    </form>
  );
};

export default LoginForm;
