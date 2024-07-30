import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../style/Profile.module.css';

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
  const dialogRef = useRef(null);
  const changePfpInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (dialogRef.current) {
      if (openProfile) {
        dialogRef.current.showModal();
      } else {
        dialogRef.current.close();
      }
    }
  }, [openProfile]);

  async function submitBio(e) {
    e.preventDefault();

    const responseStream = await fetch(
      'https://odin-messaging-app-backend.fly.dev/users',
      {
        method: 'PUT',
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bio: e.target[0].value }),
      },
    );

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
    await fetch('https://odin-messaging-app-backend.fly.dev/users', {
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

    const responseStream = await fetch(
      'https://odin-messaging-app-backend.fly.dev/users/picture',
      {
        method: 'PUT',
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      },
    );

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
    changePfpInputRef.current.value = '';
  }

  return (
    openProfile && (
      <dialog ref={dialogRef} className={styles.profile}>
        <div className={styles.imageAndName}>
          <img
            className='profilePicture'
            src={
              newImage ? URL.createObjectURL(newImage) : openProfile.pictureUrl
            }
            alt=''
          />
          <h2>{openProfile.username}</h2>
        </div>
        {openProfile._id === localStorage.getItem('userId') && (
          <>
            <form encType='multipart/form-data' onSubmit={(e) => changePfp(e)}>
              <input
                ref={changePfpInputRef}
                onChange={(e) => handleFileInputChange(e)}
                type='file'
                name='newPfp'
                id='newPfp'
                accept='image/*'
                required
                hidden
              />
              <div className={styles.buttons}>
                <button className='svgButton' type='button'>
                  <label htmlFor='newPfp'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 -960 960 960'
                    >
                      <path d='M440-200h80v-167l64 64 56-57-160-160-160 160 57 56 63-63v167ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z' />
                    </svg>
                  </label>
                </button>
                {changingPfp && (
                  <>
                    <button className='svgButton'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 -960 960 960'
                      >
                        <path d='M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z' />
                      </svg>
                    </button>
                    <button
                      className='svgButton'
                      type='button'
                      onClick={() => cancelPfpChange()}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 -960 960 960'
                      >
                        <path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z' />
                      </svg>
                    </button>
                  </>
                )}
                <button
                  type='button'
                  className='svgButton'
                  onClick={() => setEdit(true)}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 -960 960 960'
                  >
                    <path d='M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z' />
                  </svg>
                </button>
                <button type='button' onClick={() => setDeleting(true)}>
                  Delete Account
                </button>
              </div>
              {deleting && (
                <div>
                  <p className={styles.deleteConfirm}>
                    Are you sure you want to delete your account?
                  </p>
                  <div className={styles.buttons}>
                    <button onClick={() => deleteUser()}>Yes</button>
                    <button onClick={() => setDeleting(false)}>No</button>
                  </div>
                </div>
              )}
            </form>
            {edit && (
              <form onSubmit={(e) => submitBio(e)}>
                <textarea
                  className={styles.bioInput}
                  defaultValue={openProfile.bio || ''}
                  rows='10'
                ></textarea>
                <div className={styles.buttons}>
                  <button className='svgButton'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 -960 960 960'
                    >
                      <path d='M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z' />
                    </svg>
                  </button>
                  <button
                    className='svgButton'
                    type='button'
                    onClick={() => setEdit(false)}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 -960 960 960'
                    >
                      <path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z' />
                    </svg>
                  </button>
                </div>
              </form>
            )}
          </>
        )}
        {openProfile._id !== localStorage.getItem('userId') && (
          <button
            className={styles.pmButton}
            onClick={() => sendPrivateMessage(openProfile._id)}
          >
            Send Private Message
          </button>
        )}
        <p>{openProfile.bio || ''}</p>
        <button
          className={`svgButton ${styles.closeButton}`}
          onClick={() => setOpenProfile(null)}
        >
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 -960 960 960'>
            <path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z' />
          </svg>
        </button>
      </dialog>
    )
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
