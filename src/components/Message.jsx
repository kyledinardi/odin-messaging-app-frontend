import PropTypes from 'prop-types';
import { useState } from 'react';

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
      <img src={message.sender.pictureUrl} alt='' />
      <p>{message.sender.username}</p>
      <p>{new Date(message.timestamp).toLocaleString()}</p>
      {editing ? (
        <form onSubmit={(e) => updateMessage(e, message._id)}>
          <input
            type='text'
            name='messageUpdate'
            id='messageUpdate'
            defaultValue={message.text}
            required
          />
          {message.sender._id === localStorage.getItem('userId') && (
            <div>
              <button>Update</button>
              <button type='button' onClick={() => setEditing(false)}>
                Cancel
              </button>
              <button type='button' onClick={() => deleteMessage(message._id)}>
                Delete
              </button>
            </div>
          )}
        </form>
      ) : (
        <div>
          <p>{message.text}</p>
          {message.sender._id === localStorage.getItem('userId') && (
            <div>
              <button onClick={() => setEditing(true)}>Edit</button>
              <button onClick={() => deleteMessage(message._id)}>Delete</button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

Message.propTypes = {
  message: PropTypes.object,
  changeMessages: PropTypes.func,
};

export default Message;
