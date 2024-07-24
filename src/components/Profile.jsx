import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import blankPfp from '../img/blank-pfp.webp';

function Profile({ openNewRoom, openProfile, setOpenProfile }) {
  const [edit, setEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  async function submitBio(e) {
    e.preventDefault();

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
  }

  function sendPrivateMessage(userId) {
    openNewRoom(null, userId);
    setOpenProfile(null);
  }

  async function deleteUser() {
    await fetch(`http://localhost:3000/users`, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    localStorage.clear();
    navigate('/login');
  }

  function renderBio() {
    if (edit) {
      return (
        <form onSubmit={(e) => submitBio(e)}>
          <textarea defaultValue={openProfile.bio || ''}></textarea>
          <button type='button' onClick={() => setEdit(false)}>
            Cancel
          </button>
          <button>Save Bio</button>
        </form>
      );
    }
    if (openProfile._id === localStorage.getItem('userId')) {
      return (
        <div>
          <button onClick={() => setEdit(true)}>Edit Bio</button>
          <button onClick={() => setDeleting(true)}>Delete Account</button>
          {deleting && (
            <div>
              <p>Are you sure you want to delete your account?</p>
              <button onClick={() => deleteUser()}>Yes</button>
              <button onClick={() => setDeleting(false)}>No</button>
            </div>
          )}
          <p>{openProfile.bio || ''}</p>
        </div>
      );
    }

    return (
      <div>
        <button onClick={() => sendPrivateMessage(openProfile._id)}>
          Send Private Message
        </button>
        <p>{openProfile.bio || ''}</p>
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
  openNewRoom: PropTypes.func,
  openProfile: PropTypes.object,
  setOpenProfile: PropTypes.func,
};

export default Profile;
