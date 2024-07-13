import React, { useState, useEffect }  from "react";
import "../style/Chat.css";
import axios from 'axios';
import { useSelector } from "react-redux";

function Chat() {
  const senderid = useSelector((state) => state.idReducer.issend);
  const receiverid = useSelector((state) => state.idReducer.isrece);
  console.log(senderid, receiverid);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
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
      const getMessages = async () => {
          const token = localStorage.getItem('access_token');
          if (!csrfToken || !token) return;

          try {
              const response = await axios.get('http://localhost:8000/users/chats/', {
                  headers: {
                      'Content-Type': 'application/json',
                      'X-CSRFToken': csrfToken,
                      'Authorization': `Bearer ${token}`,
                  }
              });
              setMessages(response.data);
          } catch (error) {
              console.error('Error fetching messages:', error);
          }
      };

      getMessages();
  }, [csrfToken]);

  const handleSendMessage = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('access_token');
      if (!newMessage || !token) return;

      try {
          const response = await axios.post('http://localhost:8000/users/chats/', {
              sender: senderid,
              receiver: receiverid,
              message: newMessage,
          }, {
              headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFToken': csrfToken,
                  'Authorization': `Bearer ${token}`,
              }
          });
          setMessages([...messages, response.data]);
          setNewMessage("");
      } catch (error) {
          console.error('Error sending message:', error);
      }
  };
  return (
    <div className="Chat">
      <div className="ChatMessages">
        {messages.map((msg, index) => (
          <div key={index} className="ChatMessage">
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <form className="ChatForm" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;
