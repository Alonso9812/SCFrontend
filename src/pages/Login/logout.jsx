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
  
      
      window.location.href = '/';
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


