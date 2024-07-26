import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile({
  openNewRoom,
  openProfile,
  setOpenProfile,
  users,
  setUsers,
}) {
  const [edit, setEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [changingPfp, setChangingPfp] = useState(false);
  const [newImage, setNewImage] = useState(null);
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
    setUsers(users.map((user) => (user === response._id ? response : user)));
    setOpenProfile(response);
    setEdit(false);
  }

  function sendPrivateMessage(userId) {
    openNewRoom(null, userId);
    setOpenProfile(null);
  }

  async function deleteUser() {
    await fetch('http://localhost:3000/users', {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    localStorage.clear();
    navigate('/login');
  }

  async function changePfp(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('newPfp', e.target[0].files[0]);

    const responseStream = await fetch('http://localhost:3000/users/picture', {
      method: 'PUT',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    const response = await responseStream.json();
    setChangingPfp(false);
    setOpenProfile(response);
    setUsers(
      users.map((user) => (user._id === response._id ? response : user)),
    );
  }

  function handleFileInputChange(e) {
    if (e.target.value !== '') {
      setChangingPfp(true);
      setNewImage(e.target.files[0]);
    }
  }

  function cancelPfpChange() {
    setChangingPfp(false);
    setNewImage(null);
  }

  return (
    <div>
      {openProfile && (
        <>
          <img
            src={
              newImage ? URL.createObjectURL(newImage) : openProfile.pictureUrl
            }
            alt=''
          />
          {openProfile._id === localStorage.getItem('userId') && (
            <form encType='multipart/form-data' onSubmit={(e) => changePfp(e)}>
              <input
                onChange={(e) => handleFileInputChange(e)}
                type='file'
                name='newPfp'
                id='newPfp'
                accept='image/*'
                required
                hidden
              />
              <button type='button'>
                <label htmlFor='newPfp'>Upload New Profile Picture</label>
              </button>
              {changingPfp && (
                <>
                  <button>Save</button>
                  <button type='button' onClick={() => cancelPfpChange()}>
                    Cancel
                  </button>
                </>
              )}
            </form>
          )}
          <h2>{openProfile.username}</h2>
          {edit ? (
            <form onSubmit={(e) => submitBio(e)}>
              <textarea defaultValue={openProfile.bio || ''}></textarea>
              <button type='button' onClick={() => setEdit(false)}>
                Cancel
              </button>
              <button>Save Bio</button>
            </form>
          ) : (
            <div>
              {openProfile._id === localStorage.getItem('userId') ? (
                <>
                  <button onClick={() => setEdit(true)}>Edit Bio</button>
                  <button onClick={() => setDeleting(true)}>
                    Delete Account
                  </button>
                  {deleting && (
                    <div>
                      <p>Are you sure you want to delete your account?</p>
                      <button onClick={() => deleteUser()}>Yes</button>
                      <button onClick={() => setDeleting(false)}>No</button>
                    </div>
                  )}
                </>
              ) : (
                <button onClick={() => sendPrivateMessage(openProfile._id)}>
                  Send Private Message
                </button>
              )}
              <p>{openProfile.bio || ''}</p>
            </div>
          )}
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
  users: PropTypes.array,
  setUsers: PropTypes.func,
};

export default Profile;
