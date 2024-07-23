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
    fetch('http://localhost:3000/rooms', {
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          localStorage.clear();
          navigate('/login');
        }

        return response.json();
      })
      .then((response) => {
        const roomId =
          localStorage.getItem('roomId') || '669551549b1e2dd57344d631';

        setRooms(response.rooms);
        setOpenRoom(response.rooms.find((room) => room._id === roomId));
      });
  }, [navigate]);

  useEffect(() => {
    async function fetchUsers() {
      const responseStream = await fetch('http://localhost:3000/users', {
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const response = await responseStream.json();
      setUsers(response.users);
    }

    fetchUsers();

    const intervalId = setInterval(() => {
      fetchUsers();
    }, 300000);

    return () => clearInterval(intervalId);
  }, []);

  async function openNewRoom(name, userId) {
    let oldRoom = null;

    if (name) {
      oldRoom = rooms.find((room) => room.name === name);
    } else if (userId) {
      oldRoom = rooms.find((room) =>
        room.users.every(
          (user) => user._id === userId || localStorage.getItem('userId'),
        ),
      );
    }

    if (oldRoom) {
      setOpenRoom(oldRoom);
    } else {
      const responseStream = await fetch('http://localhost:3000/rooms', {
        method: 'POST',
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name || '',
          isPublic: !userId,
          users: userId ? [localStorage.getItem('userId'), userId] : [],
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
        openNewRoom={(name, userId) => openNewRoom(name, userId)}
      />
      <Chat room={openRoom} />
      <UserList
        users={users}
        setUsers={(newUsers) => setUsers(newUsers)}
        setOpenProfile={(user) => setOpenProfile(user)}
      />
      <Profile
        openNewRoom={(name, userId) => openNewRoom(name, userId)}
        openProfile={openProfile}
        setOpenProfile={(user) => setOpenProfile(user)}
      />
    </>
  );
}

export default App;
