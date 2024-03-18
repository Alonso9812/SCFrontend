import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Obtener el tiempo en milisegundos actual
    const currentTime = new Date().getTime();

    // Obtener el tiempo de expiración del token (120 minutos en milisegundos)
    const expirationTime = currentTime + (60000);

    // Guardar el tiempo de expiración en el localStorage
    localStorage.setItem('tokenExpiration', expirationTime);

    // Iniciar un temporizador para eliminar el token después de 120 minutos
    const timer = setTimeout(() => {
      // Eliminar el token del localStorage cuando expire
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
      // Aquí podrías agregar alguna lógica adicional, como redireccionar a una página de inicio de sesión
    }, 60000);

    // Limpiar el temporizador cuando el componente se desmonte para evitar fugas de memoria
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {/* Contenido de tu aplicación */}
    </div>
  );
}

export default App;
