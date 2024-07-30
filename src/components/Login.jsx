import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from '../style/Form.module.css';

function Login() {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  async function submitLogin(e) {
    e.preventDefault();
    
    const responseStream = await fetch(
      'https://odin-messaging-app-backend.fly.dev/users/login',
      {
        method: 'Post',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: e.target[0].value,
          password: e.target[1].value,
        }),
      },
    );

    const response = await responseStream.json();

    if (!response.user) {
      e.target.reset();
      setErrorMessage(response.message);
    } else {
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.user._id);
      navigate('/');
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={(e) => submitLogin(e)}>
        <div className={styles.fields}>
          <label htmlFor='username'>Username</label>
          <input type='text' name='username' id='username' required />
          <label htmlFor='password'>Password</label>
          <input type='password' name='password' id='password' required />
        </div>
        <div className={styles.error}>{errorMessage}</div>
        <div className={styles.signUp}>
          No account? <Link to='/sign-up'>Sign Up</Link>
        </div>
        <button className={styles.submitButton}>Log In</button>
      </form>
    </div>
  );
}

export default Login;
