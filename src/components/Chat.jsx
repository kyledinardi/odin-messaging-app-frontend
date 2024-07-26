import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Message from './Message.jsx';
import styles from '../style/Chat.module.css';

function Chat({ room }) {
  const [messages, setMessages] = useState(null);
  const [isMessage, setIsMessage] = useState('');
  const [messageImage, setMessageImage] = useState(null);

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
    const formData = new FormData();

    formData.append('messageImage', e.target[0].files[0]);
    formData.append('messageText', e.target[1].value);
    formData.append('roomId', room._id);

    const responseStream = await fetch('http://localhost:3000/messages', {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    const response = await responseStream.json();
    e.target.reset();
    setIsMessage(false);
    setMessages([...messages, response]);
  }

  function handleFileInputChange(e) {
    if (e.target.value !== '') {
      setIsMessage(true);
      setMessageImage(e.target.files[0]);
    }
  }

  function cancelMessageImage() {
    setIsMessage(false);
    setMessageImage(null);
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
            {messageImage && (
              <img src={URL.createObjectURL(messageImage)} alt='' />
            )}
            <input
              type='file'
              name='messageImage'
              id='messageImage'
              onChange={(e) => handleFileInputChange(e)}
              hidden
            />
            <label htmlFor='messageImage'>Upload Image</label>
            {messageImage && (
              <button type='button' onClick={() => cancelMessageImage()}>
                Cancel
              </button>
            )}
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
              onChange={(e) => setIsMessage(e.target.value !== '')}
              required
            />
            <button disabled={!isMessage}>Send</button>
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
