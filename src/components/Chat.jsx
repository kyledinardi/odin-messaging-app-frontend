import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import blankPfp from '../img/blank-pfp.webp';
import styles from '../style/Chat.module.css';

function Chat({ room }) {
  const [messages, setMessages] = useState(null);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    if (room) {
      fetch(`http://localhost:3000/messages/${room._id}`, { mode: 'cors' })
        .then((response) => response.json())
        .then((response) => setMessages(response.messages))
        .catch((err) => {
          throw new Error(err);
        });
    }
  }, [room]);

  async function sendMessage() {
    const responseStream = await fetch('http://localhost:3000/messages', {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: messageText, room: room._id }),
    });

    const response = await responseStream.json();
    setMessageText('');
    setMessages([...messages, response]);
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
    console.log(response.msg);
    setMessages(messages.filter((message) => message._id !== messageId));
  }

  return (
    <main>
      {messages && room ? (
        <>
          <div>
            {messages.map((message) => (
              <div
                key={message._id}
                className={
                  message.sender._id === localStorage.getItem('userId')
                    ? styles.currentUserMessage
                    : styles.notCurrentUserMessage
                }
              >
                <img src={message.sender.pictureUrl || blankPfp} alt='' />
                <p>{message.sender.username}</p>
                <p>{new Date(message.timestamp).toLocaleString()}</p>
                <p>{message.text}</p>
                {message.sender._id === localStorage.getItem('userId') && (
                  <div>
                    <button>Edit</button>
                    <button onClick={() => deleteMessage(message._id)}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div>
            <input
              type='text'
              name='newMessage'
              id='newMessage'
              placeholder={`Message ${
                room.name ||
                room.users.find(
                  (user) => user._id !== localStorage.getItem('userId'),
                ).username
              }`}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              required
            />
            <button onClick={() => sendMessage()} disabled={!messageText}>
              Send
            </button>
          </div>
        </>
      ) : (
        <h2>Loading messages...</h2>
      )}
    </main>
  );
}

Chat.propTypes = {
  users: PropTypes.array,
  room: PropTypes.object,
};

export default Chat;
