import {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('special-background');

    return () => {
      document.body.classList.remove('special-background');
    };
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:4000/api/user/login', {
        email,
        password
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        navigate('/home');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
      <div style={styles.container}>
        <h1 style={styles.title}>Financial Consulting</h1>
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputContainer}>
            <label htmlFor="email" style={styles.label}>Account</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={styles.input}
                required
            />
          </div>
          <div style={styles.inputContainer}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={styles.input}
                required
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.buttonLogin}>Login</button>
            <button type="button" onClick={() => navigate('/register')} style={styles.buttonRegister}>Register</button>
          </div>
        </form>
      </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: 'transparent' ,
    position: 'relative',
    left: '-100%'
  },
  title: {
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px'
  },
  inputContainer: {
    marginBottom: '15px'
  },
  label: {
    marginBottom: '5px',
    display: 'block'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  buttonLogin: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px'
  },
  buttonRegister: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px'
  }
};

export default LoginPage;
