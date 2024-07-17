import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Chat from './components/Chat.jsx';
import UserList from './components/UserList.jsx';

function App() {
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
      <UserList />
    </>
  );
}

export default App;
