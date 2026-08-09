import {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('special-background');

    return () => {
      document.body.classList.remove('special-background');
    };
  }, []);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess(false);

    if (!passwordRegex.test(password)) {
      setError('The password must be at least 8 characters long and include uppercase and lowercase letters, a number, and a special character.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/user/register', {
        name,
        email,
        password
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setSuccess(true);
        navigate('/home');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
      <div style={styles.container}>
        <h1 style={styles.title}>Register</h1>
        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.inputContainer}>
            <label htmlFor="name" style={styles.label}>Name</label>
            <input
                type="text"
                id="name"
                value={name}
                style={styles.input}
                onChange={e => setName(e.target.value)}
                required
            />
          </div>
          <div style={styles.inputContainer}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
                type="email"
                id="email"
                value={email}
                style={styles.input}
                onChange={e => setEmail(e.target.value)}
                required
            />
          </div>
          <div style={styles.inputContainer}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
                type="password"
                id="password"
                value={password}
                style={styles.input}
                onChange={e => setPassword(e.target.value)}
                required
            />
          </div>
          {error && <p style={{color: 'red'}}>{error}</p>}
          <button type="submit" style={styles.buttonRegister}>Register</button>
        </form>
        {success && <p style={{ color: 'green' }}>Registration successful! Redirecting...</p>}
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

export default Register;
