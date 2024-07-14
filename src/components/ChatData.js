import React, { useState } from "react";
import { useDispatch } from 'react-redux'
import { setReceiverId } from "../redux/idReducer";
import { useNavigate } from "react-router-dom";
import '../style/ChatData.css'

function ChatData() {
    const dispatch = useDispatch()
    const navigate = useNavigate();
  const [id, setID] = useState(0);
  

  function handleLogin() {
    dispatch(setReceiverId(id))
    navigate('/chat')
  }
  return (
    <div className="ChatData">
      <div className="ChatDataContainer">
      <h2 className='ChatDataLogin'>Chat Data</h2>
        <form onSubmit={handleLogin}>
          <div className="FormGroupchat">
            <label htmlFor="username" className="FormLabelchat">
              Receiver ID
            </label>
            <input
              type="number"
              id="senderid"
              placeholder="Enter ReceiverId"
              className="AuthSenderId"
              value={id}
              onChange={(e) => setID(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="AuthSubmit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatData;
