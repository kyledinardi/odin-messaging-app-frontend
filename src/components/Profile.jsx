import PropTypes from 'prop-types';
import blankPfp from '../img/blank-pfp.webp';

function Profile({ profileOpen, close }) {
  return (
    <div>
      {profileOpen && (
        <>
          <img src={profileOpen.pictureUrl || blankPfp} alt='' />
          <h2>{profileOpen.username}</h2>
          <p>{profileOpen.bio || ''}</p>
          <button onClick={() => close()}>Close</button>
        </>
      )}
    </div>
  );
}

Profile.propTypes = {
  profileOpen: PropTypes.object,
  close: PropTypes.func,
};

export default Profile;
