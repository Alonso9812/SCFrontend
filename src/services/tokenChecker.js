// tokenChecker.js

function checkTokenExpiration() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodificar el token
      const expirationTime = decodedToken.exp * 1000; // Convertir a milisegundos
      const currentTime = new Date().getTime(); // Tiempo actual en milisegundos
      if (currentTime > expirationTime) {
        // Token vencido, eliminar del localStorage y redirigir a '/'
        localStorage.removeItem('token');
        console.log('Token JWT ha expirado. Eliminando token del localStorage.');
        window.location.href = '/';
      }
    }
  }
  
  checkTokenExpiration(); // Llamar la función al cargar el script
  