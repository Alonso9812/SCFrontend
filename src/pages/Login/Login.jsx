import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const [loginMessage, setLoginMessage] = useState('');
  const [showContent, setShowContent] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.baseURL = 'http://127.0.0.1:8000/api/';
      axios.get('usuarios', {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      })
      .then(response => {
        const { rol } = response.data;
        if (rol === 'voluntario') {
          navigate('/access-denied');
        } else {
          navigate('/', { replace: true, state: { logged: true, email } });
        }
      })
      .catch(error => {
        console.error("Error al obtener el rol del usuario:", error);
      });
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      axios.defaults.baseURL = 'http://127.0.0.1:8000/api/';
      const response = await axios.post('loginAdmin', {
        email,
        password,
      });
  
      if (response.data.status === 'Success') {
        const { token } = response.data;
        localStorage.setItem('token', token);
        setToken(token);
        toast.success('Logueado exitosamente');
      
        // Eliminar token del localStorage después de 1 minuto
        setTimeout(() => {
          localStorage.removeItem('token');
          setToken(null);
          toast.warning('Tu sesión ha expirado');
        }, 60000); // 60000 milisegundos = 1 minuto
      
        setTimeout(() => {
          setShowContent(false);
          navigate('/home', { replace: true, state: { logged: true, email } });
        }, 1000);
      
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      
      
      } else {
        setLoginMessage('Credenciales incorrectas');
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
  
      if (error.response) {
        const { status } = error.response;
  
        if (status === 404) {
          // Usuario no encontrado
          toast.error('¡Usuario no encontrado o no tiene rol de administrador!');
          navigate('/access-denied'); // Redirigir a la página AccessDenied
        } else if (status === 401) {
          // Contraseña incorrecta
          toast.error('Contraseña incorrecta');
        } else {
          // Otro error
          toast.error('Error en la solicitud. Por favor, inténtalo de nuevo.');
        }
      } else {
        // Otro tipo de error
        toast.error('Error en la solicitud. Por favor, inténtalo de nuevo.');
      }
    }
  };
  
  return (
    <div className="Login" style={styles.container}>
      {showContent && token === null ? (
        <>
          <h2 style={styles.title}>Iniciar Sesión</h2>
          {loginMessage && (
            <p
              style={{
                color: loginMessage === 'Logueado exitosamente' ? 'green' : 'red',
                marginBottom: '10px',
              }}
            >
              {loginMessage}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={styles.formGroup}>
              <label style={styles.label}>Correo Electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            <div className="form-group" style={styles.formGroup}>
              <label style={styles.label}>Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
              <div>
                <button type="submit" style={styles.button}>
                  Iniciar Sesión
                </button>
              </div>
            </div>
          </form>
          <ToastContainer />
        </>
      ) : null}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '0 auto',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#fff',
    padding: '20px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Login;
