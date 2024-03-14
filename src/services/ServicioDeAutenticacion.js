import api from "../api/config";

export const login = async (email, password) => {
  try {
    const requestBody = {
      email: email,
      password: password
    };

    // Realiza una solicitud POST para iniciar sesión con las credenciales proporcionadas
    const response = await api.post('/login', requestBody);

    // Comprueba si la respuesta contiene un token de autenticación u otra información relevante.
    if (response.data && response.data.token) {
      // La autenticación fue exitosa. Almacena el token en el estado de la aplicación o en una cookie.
      const token = response.data.token;
      
      // Realiza cualquier otra acción necesaria, como redireccionar al usuario a la página principal.
      return { success: true, token };
    } else {
        console.log(response.data.token)
      // La autenticación falló. Puedes manejar el error según tus necesidades.
      return { success: false, message: 'Credenciales incorrectas' };
    }
  } catch (error) {
    // Maneja los errores de red o del servidor.
    return { success: false, message: 'Error de red o del servidor' };
  }
};
