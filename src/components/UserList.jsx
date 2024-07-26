import PropTypes from 'prop-types';
import styles from '../style/UserList.module.css';

function UserList({ users, setOpenProfile }) {
  function filterUsersByStatus(isOnline) {
    return users.filter((user) =>
      Date.now() - new Date(user.lastOnline) < 300000 ? isOnline : !isOnline,
    );
  }

  return (
    <aside className={styles.userList}>
      {users && (
        <>
          <h2>Online</h2>
          <ul>
            {filterUsersByStatus(true).map((user) => (
              <li key={user._id}>
                <button onClick={() => setOpenProfile(user)}>
                  <img src={user.pictureUrl} alt='' />
                  <p>{user.username}</p>
                </button>
              </li>
            ))}
          </ul>
          <h2>Offline</h2>
          <ul>
            {filterUsersByStatus(false).map((user) => (
              <li key={user._id}>
                <button onClick={() => setOpenProfile(user)}>
                  <img src={user.pictureUrl} alt='' />
                  <p>{user.username}</p>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  );
}

UserList.propTypes = {
  users: PropTypes.array,
  setOpenProfile: PropTypes.func,
};

export default UserList;
