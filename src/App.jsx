import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Chat from './components/Chat.jsx';
import UserList from './components/UserList.jsx';
import Profile from './components/Profile.jsx';

function App() {
  const [users, setUsers] = useState(null);
  const [openProfile, setOpenProfile] = useState(null);
  const [rooms, setRooms] = useState(null);
  const [openRoom, setOpenRoom] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3000/users', { mode: 'cors' }),
      fetch('http://localhost:3000/rooms', {
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    ])
      .then((responses) => {
        if (responses[1].status === 401) {
          localStorage.clear()
          navigate('/login');
        }
        return Promise.all(responses.map((response) => response.json()));
      })
      .then((responses) => {
        setUsers(responses[0].users);
        setRooms(responses[1].rooms);
        setOpenRoom(responses[1].rooms.find((room) => room.name === 'General'));
      })
      .catch((err) => {
        throw new Error(err);
      });
  }, [navigate]);

  async function openPms(userId) {
    const privateRoom = rooms.find((room) =>
      room.users.every(
        (user) => user._id === userId || localStorage.getItem('userId'),
      ),
    );

    if (privateRoom) {
      setOpenRoom(privateRoom);
    } else {
      const responseStream = await fetch('http://localhost:3000/rooms', {
        method: 'POST',
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: '',
          isPublic: false,
          users: [localStorage.getItem('userId'), userId],
        }),
      });
      const response = await responseStream.json();
      setRooms([...rooms, response]);
      setOpenRoom(response);
    }
  }

  return (
    <>
      <Sidebar
        rooms={rooms}
        users={users}
        setOpenRoom={(newRoom) => setOpenRoom(newRoom)}
        setOpenProfile={(user) => setOpenProfile(user)}
      />
      <Chat room={openRoom} />
      <UserList
        users={users}
        setUsers={(newUsers) => setUsers(newUsers)}
        setOpenProfile={(user) => setOpenProfile(user)}
      />
      <Profile
        openPms={(userId) => openPms(userId)}
        openProfile={openProfile}
        setOpenProfile={(user) => setOpenProfile(user)}
      />
    </>
  );
}

export default App;
