import PropTypes from 'prop-types';
import blankPfp from '../img/blank-pfp.webp';
import styles from '../style/UserList.module.css';

function UserList({ users, setProfileOpen }) {
  return (
    <aside className={styles.userList}>
      <ul>
        {users &&
          users.map((user) => (
            <li key={user._id}>
              <button onClick={() => setProfileOpen(user)}>
                <img src={user.pictureUrl || blankPfp} alt='' />
                <p>{user.username}</p>
              </button>
            </li>
          ))}
      </ul>
    </aside>
  );
}

UserList.propTypes = {
  users: PropTypes.array,
  setProfileOpen: PropTypes.func,
};

export default UserList;
