import React, {useEffect, useState} from 'react'
import '../style/SendInterest.css'
import { useNavigate } from "react-router-dom";
import axios from 'axios'

function SendInterest() {  
  const [users, setUsers] = useState([]);
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

useEffect(() => {
    const getUsersList = async () => {
        const token = localStorage.getItem('access_token');
        if (!csrfToken || !token) return;

        try {
            const response = await axios.get('http://localhost:8000/users/users/', {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                    'Authorization': `Bearer ${token}`,
                }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    getUsersList();
}, [csrfToken]);
    const navigate = useNavigate();
    function handleaction() {
        navigate('/actioninterest')
    }
    console.log(users);



    const handleapprove = async (receiverId) => {
      const token = localStorage.getItem('access_token');
      try {
          const response = await axios.post('http://localhost:8000/users/interests/', {
              receiver: receiverId,
          }, {
              headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFToken': csrfToken,
                  'Authorization': `Bearer ${token}`,
              }
          });
          console.log('Interest sent:', response.data);
      } catch (error) {
          console.error('Error sending interest:', error);
      }
    };
  return (
    <div className='SendInterest'>
        <button className='SendInterestAction' onClick={handleaction}>Action Interest</button>
        <table className="SendInterestTable">
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Action</th>
        </tr>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>
              <button className="ManagerApprove" onClick={()=>{handleapprove(user.id)}}>Send</button>
            </td>
          </tr>
        ))}
      </table>
    </div>
  )
}

export default SendInterest
