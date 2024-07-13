import React, { useState, useEffect } from 'react';
import '../style/Auth.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios'

function Auth() {
    const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    const getCsrfToken = async () => {
        try {
            const response = await axios.get('http://localhost:8000/users/api/csrf/');
            setCsrfToken(response.data.csrfToken);
            axios.defaults.headers.common['X-CSRFToken'] = response.data.csrfToken;
        } catch (error) {
            console.error('CSRF token fetch error:', error);
        }
    };

    getCsrfToken();
}, []);

async function handleLogin(event) {
    event.preventDefault();
    try {
        const response = await axios.post('http://localhost:8000/users/login/', {
            username,
            password,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            }
        });

        if (response.status === 200) {
            // Save the tokens in local storage
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);

            // Set the Authorization header for future requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;

            // Navigate to the sendinterest page
            navigate('/sendinterest');
        } else {
            console.error(response.data.error);
        }
    } catch (error) {
        console.error('Login error:', error);
    }
}

  function handleclick() {
    navigate('/register')
  }

  return (
    <div className='Auth'>
      <div className='AuthContainer'>
        <h2 className='AuthLogin'>User Login</h2>
        <form onSubmit={handleLogin}>
          <div className="FormGroup">
            <label htmlFor="username" className="FormLabel">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              className='AuthUserName'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="FormGroup">
            <label htmlFor="password" className="FormLabel">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className='AuthPassword'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="AuthLoginBtn">Login</button>
        </form>
        <p className='AuthNew' onClick={handleclick}>New User? Sign Up</p>
      </div>
    </div>
  );
}

export default Auth;
