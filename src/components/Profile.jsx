import PropTypes from 'prop-types';
import { useState } from 'react';
import blankPfp from '../img/blank-pfp.webp';

function Profile({ profileOpen, setProfileOpen }) {
  const [edit, setEdit] = useState(false);

  async function submitBio(e) {
    e.preventDefault();

    try {
      const responseStream = await fetch('http://localhost:3000/users', {
        method: 'PUT',
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bio: e.target[0].value }),
      });

      const response = await responseStream.json();
      setProfileOpen(response);
      setEdit(false);
    } catch (err) {
      throw new Error(err);
    }
  }

  function renderBio() {
    if (edit) {
      return (
        <form onSubmit={(e) => submitBio(e)}>
          <textarea defaultValue={profileOpen.bio || ''}></textarea>
          <button>Save Bio</button>
        </form>
      );
    }
    if (profileOpen._id === localStorage.getItem('userId')) {
      return (
        <>
          <p>{profileOpen.bio || ''}</p>
          <button onClick={() => setEdit(true)}>Edit Bio</button>
        </>
      );
    }

    return (
      <>
        <p>{profileOpen.bio || ''}</p>
        <button>Send Private Message</button>
      </>
    );
  }

  return (
    <div>
      {profileOpen && (
        <>
          <img src={profileOpen.pictureUrl || blankPfp} alt='' />
          <h2>{profileOpen.username}</h2>
          {renderBio()}
          <button onClick={() => setProfileOpen(false)}>Close</button>
        </>
      )}
    </div>
  );
}

Profile.propTypes = {
  profileOpen: PropTypes.object,
  setProfileOpen: PropTypes.func,
};

export default Profile;
