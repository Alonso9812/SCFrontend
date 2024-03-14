import api from "../api/config";

export const getUsuarios = async () => { 
    let data = await api.get('usuarios').then(result => result.data);
    
    return data;
};


export const getUsuariosID = async (id) => { 
    let data = await api.get(`usuarios/${id}`).then(result => result.data);
    return data;
};
// export const update = async (id) => { 
//     let data = await api.put(`user-update/${id}`).then(result => result.data);
//     return data;
// };

export const updateUsuario = async (newData) => { 
    
    console.log(newData);    
    // En este punto, `newData` debe ser un objeto con los datos del usuario a actualizar
    let data = await api.put(`user-update/${newData.id}`, newData).then(result => result.data);
    return data;
};

export const create = async (usuarios) => { 
    console.log(usuarios)
    let data = await api.post('create-usuario', usuarios).then(result => result.data);
    return data;
};



export const ELiminarUsuario = async (id) => {
        try {
            const response = await api.delete(`user-delete/${id}`);
            console.log(response.data);
        } catch (error) {
        
            console.error(error);
        } 
    };
    


    export const actualizarEstadoUsuario = async (id, newStatus) => {
      try {
        // Realizar la solicitud PUT para actualizar el estado del usuario
        const response = await api.put(`usuario-status/${id}`, {
          status: newStatus,
        });
    
        // Devolver la respuesta del servidor
        return response.data;
      } catch (error) {
        // Manejar errores
        console.error(error);
      }
    }

export const login = async (email, password) => {
  try {
    // Realiza una solicitud POST para iniciar sesión con las credenciales proporcionadas
    const response = await api.post('/login', { email, password });

    // Comprueba si la respuesta contiene un token de autenticación u otra información relevante.
    if (response.data.token) {
      // La autenticación fue exitosa. Puedes almacenar el token en el estado de la aplicación o en una cookie.
      const token = response.data.token;
      // Realiza cualquier otra acción necesaria, como redireccionar al usuario a la página principal.
      return { success: true, token };
    } else {
      // La autenticación falló. Puedes manejar el error según tus necesidades.
      return { success: false, message: 'Credenciales incorrectas' };
    }
  } catch (error) {
    // Maneja los errores de red o del servidor.
    return { success: false, message: 'Error de red o del servidor' };
  }
};
