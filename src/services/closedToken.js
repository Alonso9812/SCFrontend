// Función para eliminar el token del localStorage
function eliminarToken(event) {
    // Verificar si la recarga de página está ocurriendo
    if (event.currentTarget.performance.navigation.type !== 1) {
      localStorage.removeItem('miToken');
    }
  }
  
  // Evento antes de cerrar la ventana
  window.addEventListener('beforeunload', eliminarToken);
  
  // Evento cuando la ventana se cierra
  window.addEventListener('unload', eliminarToken);
  