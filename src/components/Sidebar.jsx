import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from '../style/Sidebar.module.css';

function Sidebar({
  rooms,
  users,
  setOpenRoom,
  setOpenProfile,
  openNewRoom,
  sidebarOpen,
  closeSidebar,
}) {
  const [newRoomInputVisible, setNewRoomInputVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (users) {
      const thisUser = users.find(
        (user) => user._id === localStorage.getItem('userId'),
      );

      setCurrentUser(thisUser);
    }
  }, [users]);

  function filterRooms(isPublic) {
    return rooms.filter((room) => (isPublic ? room.isPublic : !room.isPublic));
  }

  function setRoom(newRoom) {
    setOpenRoom(newRoom);
    closeSidebar();
    localStorage.setItem('roomId', newRoom._id);
  }

  async function createRoom(e) {
    e.preventDefault();
    openNewRoom(e.target[0].value, null);
    setNewRoomInputVisible(false);
  }

  async function logout() {
    await fetch('https://odin-messaging-app-backend.fly.dev/users/logout', {
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    localStorage.clear();
    navigate('/login');
  }

  return (
    <aside
      className={`${styles.sidebar}${
        sidebarOpen ? ` ${styles.isVisible}` : ''
      }`}
    >
      <div className={styles.container}>
        {rooms ? (
          <div>
            <div>
              <h2>Public Chatrooms</h2>
              {newRoomInputVisible ? (
                <form
                  className={styles.newRoomForm}
                  onSubmit={(e) => createRoom(e)}
                >
                  <div className={styles.newRoomField}>
                    <label htmlFor='name'>New Room Name </label>
                    <input type='text' name='name' id='name' required />
                  </div>
                  <button
                    className='svgButton'
                    type='button'
                    onClick={() => setNewRoomInputVisible(false)}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 -960 960 960'
                    >
                      <path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z' />
                    </svg>
                  </button>
                  <button className='svgButton'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 -960 960 960'
                    >
                      <path d='M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z' />
                    </svg>
                  </button>
                </form>
              ) : (
                <div className={styles.openFormButton}>
                  <button
                    onClick={() => setNewRoomInputVisible(true)}
                    className='svgButton'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 -960 960 960'
                    >
                      <path d='M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z' />
                    </svg>
                  </button>
                </div>
              )}
              <ul className={styles.roomList}>
                {filterRooms(true).map((publicRoom) => (
                  <li key={publicRoom._id}>
                    <button onClick={() => setRoom(publicRoom)}>
                      {publicRoom.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {filterRooms(false).length > 0 && (
              <div>
                <h2>Private Messages</h2>
                <ul className={styles.roomList}>
                  {filterRooms(false).map((privateRoom) => (
                    <li key={privateRoom._id}>
                      <button onClick={() => setRoom(privateRoom)}>
                        {
                          privateRoom.users.find(
                            (user) =>
                              user._id !== localStorage.getItem('userId'),
                          ).username
                        }
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <h2>Loading rooms...</h2>
        )}
        <div className={styles.empty}></div>
        {currentUser ? (
          <div className={styles.profile}>
            <button
              className={styles.profileButton}
              onClick={() => setOpenProfile(currentUser)}
            >
              <img
                className='profilePicture'
                src={currentUser.pictureUrl}
                alt=''
              />
              <p>{currentUser.username}</p>
            </button>
            <button onClick={() => logout()}>Log Out</button>
          </div>
        ) : (
          <h2>Loading user...</h2>
        )}
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  rooms: PropTypes.array,
  users: PropTypes.array,
  setOpenRoom: PropTypes.func,
  setOpenProfile: PropTypes.func,
  openNewRoom: PropTypes.func,
  sidebarOpen: PropTypes.bool,
  closeSidebar: PropTypes.func,
};

export default Sidebar;
