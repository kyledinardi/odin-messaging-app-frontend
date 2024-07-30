import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import Message from './Message.jsx';
import styles from '../style/Chat.module.css';

function Chat({ room }) {
  const [messages, setMessages] = useState(null);
  const [isMessage, setIsMessage] = useState(false);
  const [messageImage, setMessageImage] = useState(null);
  const messageForm = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (room) {
      fetch(`https://odin-messaging-app-backend.fly.dev/messages/${room._id}`, {
        mode: 'cors',
      })
        .then((response) => response.json())
        .then((response) => setMessages(response.messages))
        .catch((err) => {
          throw new Error(err);
        });
    }
  }, [room]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
    formData.append('messageText', e.target[2].value);
    formData.append('roomId', room._id);

    const responseStream = await fetch(
      'https://odin-messaging-app-backend.fly.dev/messages',
      {
        method: 'POST',
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      },
    );

    const response = await responseStream.json();
    e.target.reset();
    setIsMessage(false);
    setMessageImage(null);
    setMessages([...messages, response]);
  }

  function handleInputChange() {
    setIsMessage(messageForm.current[0].value || messageForm.current[2].value);
  }

  function handleFileInputChange(e) {
    if (e.target.value !== '') {
      setMessageImage(e.target.files[0]);
    }

    handleInputChange();
  }

  function cancelMessageImage() {
    fileInputRef.current.value = '';
    setMessageImage(null);
    handleInputChange();
  }

  return (
    <main className={styles.chat}>
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
          <div className={styles.messageList}>
            <div className={styles.empty}></div>
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
            <div ref={messagesEndRef}></div>
          </div>
          {messageImage && (
            <div className={styles.messageImage}>
              <img src={URL.createObjectURL(messageImage)} alt='' />
              <button
                className='svgButton'
                onClick={() => cancelMessageImage()}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 -960 960 960'
                >
                  <path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z' />
                </svg>
              </button>
            </div>
          )}
          <form
            ref={messageForm}
            onSubmit={(e) => sendMessage(e)}
            className={styles.messageForm}
          >
            <input
              type='file'
              name='messageImage'
              id='messageImage'
              accept='image/*'
              ref={fileInputRef}
              onChange={(e) => handleFileInputChange(e)}
              hidden
            />
            <button type='button' className='svgButton'>
              <label htmlFor='messageImage'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 -960 960 960'
                >
                  <path d='M440-200h80v-167l64 64 56-57-160-160-160 160 57 56 63-63v167ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z' />
                </svg>
              </label>
            </button>
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
              onChange={() => handleInputChange()}
              required
            />
            <button
              className={`svgButton ${styles.sendButton}`}
              disabled={!isMessage}
            >
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 -960 960 960'>
                <path d='M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z' />
              </svg>
            </button>
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
