import { toast } from 'react-toastify';

const Logout = () => {
    const handleLogout = () => {
      // Eliminar el token del localStorage
      localStorage.removeItem('token');
  
      // Mostrar notificación de cierre de sesión
      toast.info('Has cerrado sesión');
  
      setTimeout(() => {
        window.location.reload();
      }, 1000);
  
      // Puedes redirigir al usuario a la página de inicio de sesión o realizar otras acciones necesarias
      window.location.href = '/login';
    };
  
    return (
      <div className='btnCerrarSesionContainer'>
        <button className='btnCerrarSesion' onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
    );
  };
  
  export default Logout;


