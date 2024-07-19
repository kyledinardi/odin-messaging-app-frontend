import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Chat from './components/Chat.jsx';
import UserList from './components/UserList.jsx';
import Profile from './components/Profile.jsx';

function App() {
  const [users, setUsers] = useState(null);
  const [profileOpen, setProfileOpen] = useState(null);
  const [room, setRoom] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3000/users', { mode: 'cors' }),
      fetch('http://localhost:3000/rooms/669551549b1e2dd57344d631', {
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    ])
      .then((responses) =>
        Promise.all(responses.map((response) => response.json())),
      )
      .then((responses) => {
        setUsers(responses[0].users);
        setRoom(responses[1]);
      })
      .catch((err) => {
        throw new Error(err);
      });
  }, [setUsers]);

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
      <Sidebar setRoom={(newRoom) => setRoom(newRoom)} />
      <Chat room={room} />
      <UserList
        users={users}
        setUsers={(newUsers) => setUsers(newUsers)}
        setProfileOpen={(user) => setProfileOpen(user)}
      />
      <Profile
        profileOpen={profileOpen}
        setProfileOpen={(user) => setProfileOpen(user)}
      />
    </>
  );
}

export default App;
