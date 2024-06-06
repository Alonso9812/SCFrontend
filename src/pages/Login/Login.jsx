import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  

  useEffect(() => {
    // Verificar si hay un token en el localStorage al cargar el componente
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard/home'); // Redirigir al usuario a /dashboard/home si hay un token
    }
  }, [navigate]); // Se ejecuta solo cuando el componente se monta o cuando navigate cambia

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://senderocornizuelo.xyz/api/login', { email, password });
      const { status, user, authorisation } = response.data;
      if (status === 'success') {
        console.log('Usuario autenticado:', user);
        console.log('Token de autorización:', authorisation.token);
        
        // Verificar si el usuario es voluntario
        if (user.rol === 'voluntario') {
          // Si es voluntario, redirigir a la página de acceso denegado sin recargar la página
          navigate('/access-denied');
        } else {
          // Si no es voluntario, guardar el token y redirigir a la página de inicio
          localStorage.setItem('token', authorisation.token);
          toast.success('Inicio de sesión exitoso');
          // Redirigir al usuario a la página de inicio después de un inicio de sesión exitoso
          navigate('/dashboard/home', { replace: true });
          // Recargar la página después de un inicio de sesión exitoso
          window.location.reload();
        }
      } else {
        setError('Correo electrónico o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="login-background">
      <div className="wrapper">
        <form onSubmit={handleLogin}>
          <h2>Iniciar Sesión</h2>
          <div className="input-box">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo Electrónico"
              required
            />
            <span className="i">
              <FontAwesomeIcon icon="user" />
            </span>
          </div>
          <div className="input-box">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
            />
            <span className="i">
              <FontAwesomeIcon icon="lock" />
            </span>
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Recordarme
            </label>
          </div>
          <button type="submit" className="btn">
            Iniciar Sesión
          </button>
          <div className="register-link">
            <p>
              Inicio de Sesión para la
              <a href="#"> Gestión de Módulos</a>
            </p>
          </div>
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};


export default Login;
