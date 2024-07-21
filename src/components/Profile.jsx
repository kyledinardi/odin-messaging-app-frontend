import PropTypes from 'prop-types';
import { useState } from 'react';
import blankPfp from '../img/blank-pfp.webp';

function Profile({ openPms, openProfile, setOpenProfile }) {
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
      setOpenProfile(response);
      setEdit(false);
    } catch (err) {
      throw new Error(err);
    }
  }

  function sendPrivateMessage(userId) {
    openPms(userId);
    setOpenProfile(null);
  }

  function renderBio() {
    if (edit) {
      return (
        <form onSubmit={(e) => submitBio(e)}>
          <textarea defaultValue={openProfile.bio || ''}></textarea>
          <button type='button' onClick={() => setEdit(false)}>Cancel</button>
          <button>Save Bio</button>
        </form>
      );
    }
    if (openProfile._id === localStorage.getItem('userId')) {
      return (
        <div>
          <p>{openProfile.bio || ''}</p>
          <button onClick={() => setEdit(true)}>Edit Bio</button>
        </div>
      );
    }

    return (
      <div>
        <p>{openProfile.bio || ''}</p>
        <button onClick={() => sendPrivateMessage(openProfile._id)}>
          Send Private Message
        </button>
      </div>
    );
  }

  return (
    <div>
      {openProfile && (
        <>
          <img src={openProfile.pictureUrl || blankPfp} alt='' />
          <h2>{openProfile.username}</h2>
          {renderBio()}
          <button onClick={() => setOpenProfile(null)}>Close</button>
        </>
      )}
    </div>
  );
}

Profile.propTypes = {
  openPms: PropTypes.func,
  openProfile: PropTypes.object,
  setOpenProfile: PropTypes.func,
};

export default Profile;
