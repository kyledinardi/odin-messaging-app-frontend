import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Chat from './components/Chat.jsx';
import UserList from './components/UserList.jsx';
import Profile from './components/Profile.jsx';

function App() {
  const [profileOpen, setProfileOpen] = useState(null);
  const navigate = useNavigate();

  return (
    <>
      <button
        onClick={() => {
          localStorage.clear();
          navigate('/login');
        }}
      >
        Log Out
      </button>
      <Sidebar />
      <Chat />
      <UserList setProfileOpen={(user) => setProfileOpen(user)} />
      <Profile profileOpen={profileOpen} close={() => setProfileOpen(null)} />
    </>
  );
}

export default App;
