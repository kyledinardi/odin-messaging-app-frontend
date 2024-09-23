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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userListOpen, setUserListOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
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
        setRooms(response.rooms);
        const roomId = parseInt(localStorage.getItem('roomId'), 10);
        let roomToOpen = response.rooms.find((room) => room.id === roomId);

        if (!roomToOpen) {
          roomToOpen = response.rooms.find((room) => room.name === 'General');
        }

        setOpenRoom(roomToOpen);
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

  useEffect(() => {
    setChatOpen(!sidebarOpen && !userListOpen);
  }, [sidebarOpen, userListOpen]);

  async function openNewRoom(name, userId) {
    let oldRoom = null;
    setUserListOpen(false);

    if (name) {
      oldRoom = rooms.find((room) => room.name === name);
    }

    if (userId) {
      oldRoom = rooms.find(
        (room) =>
          room.users.length === 2 &&
          room.users.some((user) => user.id === userId) &&

          room.users.some(
            (user) => user.id === parseInt(localStorage.getItem('userId'), 10),
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
          userId,
        }),
      });

      const response = await responseStream.json();
      setRooms([...rooms, response]);
      setOpenRoom(response);
    }
  }
  return (
    <div>
      <nav className='navbar'>
        <button
          className='sidebarButton'
          onClick={() => {
            setSidebarOpen(!sidebarOpen);
            setUserListOpen(false);
          }}
        >
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 -960 960 960'>
            <path d='M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z' />
          </svg>
        </button>
        <button
          className='userListButton'
          onClick={() => {
            setUserListOpen(!userListOpen);
            setSidebarOpen(false);
          }}
        >
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 -960 960 960'>
            <path d='M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z' />
          </svg>
        </button>
      </nav>
      <div className='app'>
        <Sidebar
          rooms={rooms}
          users={users}
          setOpenRoom={(newRoom) => setOpenRoom(newRoom)}
          setOpenProfile={(user) => setOpenProfile(user)}
          openNewRoom={(name, userId) => openNewRoom(name, userId)}
          sidebarOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
        />
        <Chat room={openRoom} chatOpen={chatOpen} />
        <UserList
          users={users}
          setUsers={(newUsers) => setUsers(newUsers)}
          setOpenProfile={(user) => setOpenProfile(user)}
          userListOpen={userListOpen}
        />
        <Profile
          openNewRoom={(name, userId) => openNewRoom(name, userId)}
          openProfile={openProfile}
          setOpenProfile={(user) => setOpenProfile(user)}
          users={users}
          setUsers={(newUsers) => setUsers(newUsers)}
        />
      </div>
    </div>
  );
}

export default App;
