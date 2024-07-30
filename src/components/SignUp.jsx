import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../style/Form.module.css';

function SignUp() {
  const [errorArray, setErrorArray] = useState(null);
  const navigate = useNavigate();

  async function submitLogin(e) {
    e.preventDefault();

    try {
      const responseStream = await fetch(
        'https://odin-messaging-app-backend.fly.dev/users',
        {
          method: 'Post',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: e.target[0].value,
            password: e.target[1].value,
            passwordConfirmation: e.target[2].value,
          }),
        },
      );

      const response = await responseStream.json();

      if (!response.user) {
        e.target.reset();
        setErrorArray(response.errors);
      } else {
        navigate('/');
      }
    } catch (err) {
      throw new Error(err);
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
          <label htmlFor='passwordConfirmation'>Confirm Password</label>
          <input
            type='password'
            name='passwordConfirmation'
            id='passwordConfirmation'
            required
          />
        </div>
        <div className={styles.error}>
          {errorArray &&
            errorArray.map((error) => <p key={error.msg}>{error.msg}</p>)}
        </div>
        <button className={styles.submitButton}>Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;
