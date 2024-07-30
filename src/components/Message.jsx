import PropTypes from 'prop-types';
import { useState } from 'react';
import styles from '../style/Message.module.css';

function Message({ message, changeMessages }) {
  const [editing, setEditing] = useState(false);

  async function updateMessage(e, messageId) {
    e.preventDefault();

    const responseStream = await fetch(
      `http://localhost:3000/messages/${messageId}`,
      {
        method: 'PUT',
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: e.target[0].value }),
      },
    );

    const response = await responseStream.json();
    changeMessages(response, 'update');
    setEditing(false);
  }

  async function deleteMessage(messageId) {
    const responseStream = await fetch(
      `http://localhost:3000/messages/${messageId}`,
      {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    );

    const response = await responseStream.json();
    changeMessages(response, 'delete');
  }

  return (
    <>
      <p className={styles.timestamp}>{new Date(message.timestamp).toLocaleString()}</p>
      <div className={styles.messageBox}>
        <div className={styles.userBox}>
          <img
            className='profilePicture'
            src={message.sender.pictureUrl}
            alt=''
          />
          <strong className={styles.username}>{message.sender.username}</strong>
        </div>
        {editing ? (
          <form onSubmit={(e) => updateMessage(e, message._id)}>
            <input
              className={styles.messageUpdate}
              type='text'
              name='messageUpdate'
              id='messageUpdate'
              defaultValue={message.text}
              required
            />
            {message.imageUrl && <img src={message.imageUrl} alt='' />}
            {message.sender._id === localStorage.getItem('userId') && (
              <div className={styles.buttonRow}>
                <button className='svgButton'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 -960 960 960'
                  >
                    <path d='M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z' />
                  </svg>
                </button>
                <button
                  type='button'
                  className='svgButton'
                  onClick={() => setEditing(false)}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 -960 960 960'
                  >
                    <path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z' />
                  </svg>
                </button>
                <button
                  type='button'
                  className='svgButton'
                  onClick={() => deleteMessage(message._id)}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 -960 960 960'
                  >
                    <path d='M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z' />
                  </svg>
                </button>
              </div>
            )}
          </form>
        ) : (
          <div>
            <div className={styles.messageContent}>
              <p>{message.text}</p>
              {message.imageUrl && <img src={message.imageUrl} alt='' />}
              {message.sender._id === localStorage.getItem('userId') && (
                <div className={styles.buttonRow}>
                  <button
                    className='svgButton'
                    onClick={() => setEditing(true)}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 -960 960 960'
                    >
                      <path d='M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z' />
                    </svg>
                  </button>
                  <button
                    className='svgButton'
                    onClick={() => deleteMessage(message._id)}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 -960 960 960'
                    >
                      <path d='M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z' />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

Message.propTypes = {
  message: PropTypes.object,
  changeMessages: PropTypes.func,
};

export default Message;
