import './App.css';
import { Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';
import Register from './components/Register';
import SendInterest from './components/SendInterest';
import ActionInterest from './components/ActionInterest';
import Chat from './components/Chat';
import ChatData from './components/ChatData';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Auth />} />
        <Route path='/register' element={<Register />} />
        <Route path='/sendinterest' element={<SendInterest />} />
        <Route path='/actioninterest' element={<ActionInterest />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/chatdata' element={<ChatData />} />
      </Routes>
    </div>
  );
}

export default App;
