import React, { useEffect, useState } from "react";
import "../style/ActionInterest.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { setReceiverId, setSendid } from "../redux/idReducer";

function ActionInterest() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [interests, setInterests] = useState([]);
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/users/api/csrf/"
        );
        setCsrfToken(response.data.csrfToken);
        axios.defaults.headers.common["X-CSRFToken"] = response.data.csrfToken;
      } catch (error) {
        console.error("CSRF token fetch error:", error);
      }
    };

    getCsrfToken();
  }, []);

  useEffect(() => {
    const getInterests = async () => {
      const token = localStorage.getItem("access_token");
      if (!csrfToken || !token) return;

      try {
        const response = await axios.get(
          "http://localhost:8000/users/interests/",
          {
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken,
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setInterests(response.data);
      } catch (error) {
        console.error("Error fetching interests:", error);
      }
    };

    getInterests();
  }, [csrfToken]);
  console.log(interests);
  useEffect(() => {
    // Log receivers when interests state updates
    console.log("Receivers:");
    interests.forEach((interest) => {
      dispatch(setSendid(interest.receiver))
    });
  }, [interests]);


  const handleAccept = async (interestId, senderid, receiverid) => {
    dispatch(setReceiverId(senderid))
    dispatch(setSendid(receiverid))
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.post(
        `http://localhost:8000/users/interests/${interestId}/accept/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Interest accepted:", response.data);
      setInterests(interests.filter((interest) => interest.id !== interestId));
      if (!csrfToken || !token) return;

      try {
        const response = await axios.get(
          "http://localhost:8000/users/interests/",
          {
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken,
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setInterests(response.data);
        navigate('/chat')
      } catch (error) {
        console.error("Error fetching interests:", error);
      }
    } catch (error) {
      console.error("Error accepting interest:", error);
    }
  };

  const handleReject = async (interestId) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.post(
        `http://localhost:8000/users/interests/${interestId}/reject/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Interest rejected:", response.data);
      setInterests(interests.filter((interest) => interest.id !== interestId));
      if (!csrfToken || !token) return;

      try {
        const response = await axios.get(
          "http://localhost:8000/users/interests/",
          {
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken,
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setInterests(response.data);
      } catch (error) {
        console.error("Error fetching interests:", error);
      }
    } catch (error) {
      console.error("Error rejecting interest:", error);
    }
  };
  function handlechat() {
    navigate('/chatdata')
  }

  return (
    <div className="ActionInterest">
      <h2 className="ActionInterestHead">Received Interests</h2>
      <table className="ActionInterestTable">
        <thead>
          <tr>
            <th>Sender</th>
            <th>Accept</th>
            <th>Reject</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {interests.map((interest) => (
            <tr key={interest.id}>
              <td>{interest.sender}</td>
              <td>
                <button
                  className="AcceptBtn"
                  onClick={() => handleAccept(interest.id,interest.sender, interest.receiver)}
                >
                  Accept
                </button>
              </td>
              <td>
              <button
                  className="RejectBtn"
                  onClick={() => handleReject(interest.id)}
                >
                  Reject
                </button>
              </td>
              <td>{interest.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className='ActionInterestChat' onClick={handlechat}>Chat</button>
    </div>
  );
}

export default ActionInterest;
