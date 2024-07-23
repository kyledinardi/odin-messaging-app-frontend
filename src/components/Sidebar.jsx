import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import blankPfp from '../img/blank-pfp.webp';

function Sidebar({ rooms, users, setOpenRoom, setOpenProfile }) {
  const navigate = useNavigate();

  function filterRooms(isPublic) {
    return rooms.filter((room) => (isPublic ? room.isPublic : !room.isPublic));
  }

  function setRoom(newRoom) {
    setOpenRoom(newRoom);
    localStorage.setItem('roomId', newRoom._id);
  }

  function renderUserBox() {
    if (users) {
      const currentUser = users.find(
        (user) => user._id === localStorage.getItem('userId'),
      );

      return (
        currentUser && (
          <div>
            <button onClick={() => setOpenProfile(currentUser)}>
              <img src={currentUser.pictureUrl || blankPfp} alt='' />
              <p>{currentUser.username}</p>
            </button>
          </div>
        )
      );
    }

    return <h2>Loading user...</h2>;
  }

  return (
    <aside>
      {rooms ? (
        <div>
          <div>
            <h2>Public Chatrooms</h2>
            <ul>
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
              <ul>
                {filterRooms(false).map((privateRoom) => (
                  <li key={privateRoom._id}>
                    <button onClick={() => setRoom(privateRoom)}>
                      {
                        privateRoom.users.find(
                          (user) => user._id !== localStorage.getItem('userId'),
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
      {renderUserBox()}
      <button
        onClick={() => {
          localStorage.clear();
          navigate('/login');
        }}
      >
        Log Out
      </button>
    </aside>
  );
}

Sidebar.propTypes = {
  rooms: PropTypes.array,
  users: PropTypes.array,
  setOpenRoom: PropTypes.func,
  setOpenProfile: PropTypes.func,
};

export default Sidebar;
