import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Chat from './components/Chat.jsx';
import UserList from './components/UserList.jsx';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();
  useEffect(() => setIsAuth(!!localStorage.getItem('token')), []);

  if (!isAuth) {
    navigate('/login');
  }

  return (
    <>
      <Sidebar />
      <Chat />
      <UserList />
    </>
  );
}

export default App;
