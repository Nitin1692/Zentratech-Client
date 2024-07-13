import React, {useState, useEffect} from 'react'
import '../style/Register.css'
import axios  from 'axios';
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
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

  async function handleRegister(event) {
    event.preventDefault();
    if (password1 !== password2) {
        alert('Passwords do not match');
        return;
    }
    try {
        const response = await axios.post('http://localhost:8000/users/register/', {
            username,
            email,
            password1,
            password2
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            }
        });

        if (response.status === 200) {
            console.log('Registration successful');
            navigate('/')
        } else {
            console.error(response.data.error);
        }
    } catch (error) {
        console.error('Registration error:', error);
    }
}
  return (
    <div className='Register'>
    <div className='RegisterContainer'>
        <h2 className='RegisterLogin'>Register</h2>
        <form onSubmit={handleRegister}>
            <div className="FormGroup">
                <label htmlFor="username" className="FormLabels">Username</label>
                <input
                    type="text"
                    id="username"
                    placeholder="Enter your username"
                    className='RegisterUserName'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div className="FormGroup">
                <label htmlFor="email" className="FormLabels">Email</label>
                <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    className='RegisterEmail'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="FormGroup">
                <label htmlFor="password" className="FormLabels">Password</label>
                <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    className='RegisterPassword'
                    value={password1}
                    onChange={(e) => setPassword1(e.target.value)}
                    required
                />
            </div>
            <div className="FormGroup">
                <label htmlFor="confirmPassword" className="FormLabels">Confirm Password</label>
                <input
                    type="password"
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    className='RegisterConfirmPassword'
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="RegisterLoginBtn">Signup</button>
        </form>
    </div>
</div>
  )
}

export default Register
