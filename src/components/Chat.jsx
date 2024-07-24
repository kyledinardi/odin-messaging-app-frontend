import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Message from './Message.jsx';
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

  function changeMessages(messageToChange, operation) {
    let newMessages;

    switch (operation) {
      case 'update':
        newMessages = messages.map((message) =>
          message._id === messageToChange._id ? messageToChange : message,
        );
        break;
      case 'delete':
        newMessages = messages.filter(
          (message) => message._id !== messageToChange._id,
        );
        break;
      default:
        throw new Error(`Operation ${operation} is not available`);
    }

    setMessages(newMessages);
  }

  async function sendMessage(e) {
    e.preventDefault();

    try {
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
    } catch (err) {
      throw new Error(err);
    }
  }

  return (
    <main>
      {messages ? (
        <>
          <h1>
            {room.isPublic
              ? `${room.name} Chat`
              : `Chat with ${
                  room.users.find(
                    (user) => user._id !== localStorage.getItem('userId'),
                  ).username
                }`}
          </h1>
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
                <Message
                  message={message}
                  changeMessages={(messageToChange, operation) =>
                    changeMessages(messageToChange, operation)
                  }
                />
              </div>
            ))}
          </div>
          <form onSubmit={(e) => sendMessage(e)}>
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
            <button disabled={!messageText}>Send</button>
          </form>
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
