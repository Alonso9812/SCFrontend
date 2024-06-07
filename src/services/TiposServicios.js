import api from "../api/config";

export const getTipos = async () => { 
    let data = await api.get('ver-tipo').then(result => result.data);
    return data;
};

export const getTipoID = async (id) => { 
    let data = await api.get(`ver-tipo/${id}`).then(result => result.data);
    return data;
};

export const create = async (tipoVolCamp) => { 
    let data = await api.post('create-tipoVolCamp', tipoVolCamp).then(result => result.data);
    return data;
};

export const actualizarEstadoTipo = async (id, newStatus) => {
    try {
      // Realizar la solicitud PUT para actualizar el estado del usuario
      const response = await api.put(`tipo-status/${id}`, {
        statusVC: newStatus,
      });
  
      // Devolver la respuesta del servidor
      return response.data;
    } catch (error) {
      // Manejar errores
      console.error(error);
    }
  }

  export const eliminarTipo = async (id) => {
    try {
      const response = await api.delete(`delete-tipo/${id}`);
      console.log(response.data);
    } catch (error) {
      if (error.response && error.response.status === 500) {
        throw new Error('Error: Usuario está ligado a otra tabla');
      } else {
        throw error; // Lanza otros errores para que puedan ser manejados adecuadamente
      }
    }
  };
  
export const updateTipo = async (newData) => { 
    
    console.log(newData);    
    // En este punto, `newData` debe ser un objeto con los datos de la reserva  a actualizar
    let data = await api.put(`update-tipo/${newData.id}`, newData).then(result => result.data);
    return data;
};
