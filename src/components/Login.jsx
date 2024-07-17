import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from '../style/Form.module.css';

function Login() {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  async function submitLogin(e) {
    e.preventDefault();

    try {
      const responseStream = await fetch('http://localhost:3000/users/login', {
        method: 'Post',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: e.target[0].value,
          password: e.target[1].value,
        }),
      });

      const response = await responseStream.json();

      if (!response.user) {
        e.target.reset();
        setErrorMessage(response.message);
      } else {
        localStorage.setItem('token', response.token);
        navigate('/');
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  return (
    <form onSubmit={(e) => submitLogin(e)}>
      <div className={styles.fields}>
        <label htmlFor='username'>Username:</label>
        <input type='text' name='username' id='username' required />
        <label htmlFor='password'>Password:</label>
        <input type='password' name='password' id='password' required />
      </div>
      <div className={styles.error}>{errorMessage}</div>
      <div>
        No account? <Link to='/sign-up'>Sign Up</Link>
      </div>
      <button>Log In</button>
    </form>
  );
}

export default Login;
