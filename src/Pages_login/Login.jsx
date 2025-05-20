import React, { useState } from 'react';
import './LoginStyles.css';
import { Admin } from './Admin';

export function Login() {
  const [login, setLogin] = useState({ email: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const isCorrect =
      login.email === "mouhatta@gmail.com" &&
      login.password === "admin";

    if (isCorrect) {
      setIsLoggedIn(true); 
    } else {
      setError("Email ou mot de passe incorrect.");
      setLogin({ email: '', password: '' });
    }
  };

  if (isLoggedIn) {
    return <Admin />;
  }

  return (
    <div className="login-container">
      <h2 className="login-title">Connexion</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            Email:
            <input
              className="form-input"
              type="text"
              name="email"
              value={login.email}
              onChange={(e) => setLogin({ ...login, email: e.target.value })}
            />
          </label>
        </div>
        <div className="form-group">
          <label className="form-label">
            Password:
            <input
              className="form-input"
              type="password"
              name="password"
              value={login.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
            />
          </label>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button className="submit-button" type="submit">Se connecter</button>
      </form>
    </div>
  );
}
