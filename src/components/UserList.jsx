import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import blankPfp from '../img/blank-pfp.webp';
import styles from '../style/UserList.module.css';

function UserList({ setProfileOpen }) {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/users', { mode: 'cors' })
      .then((response) => response.json())
      .then((response) => setUsers(response.users))
      .catch((err) => {
        throw new Error(err);
      });
  }, []);

  return (
    <aside className={styles.userList}>
      <ul>
        {users &&
          users.map((user) => (
            <li key={user._id}>
              <button
                onClick={() => {
                  setProfileOpen(user);
                }}
              >
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
  setProfileOpen: PropTypes.func,
};

export default UserList;
