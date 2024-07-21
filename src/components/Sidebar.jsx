import PropTypes from 'prop-types';

function Sidebar({ rooms, setOpenRoom }) {
  function filterRooms(isPublic) {
    return rooms.filter((room) => (isPublic ? room.isPublic : !room.isPublic));
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
                  <button onClick={() => setOpenRoom(publicRoom)}>
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
                    <button onClick={() => setOpenRoom(privateRoom)}>
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
    </aside>
  );
}

Sidebar.propTypes = {
  rooms: PropTypes.array,
  setOpenRoom: PropTypes.func,
};

export default Sidebar;
