import { useState, useEffect } from 'react';
import Login from './components/Login.jsx';
import Sidebar from './components/Sidebar.jsx';
import Chat from './components/Chat.jsx';
import UserList from './components/UserList.jsx';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => setIsAuth(!!localStorage.getItem('token')), []);

  if (!isAuth) {
    return <Login setIsAuth={(a) => setIsAuth(a)} />;
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
