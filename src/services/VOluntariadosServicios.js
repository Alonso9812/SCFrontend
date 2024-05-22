import api from "../api/config";

export const getVOluntariado = async () => { 
    let data = await api.get('mostrar-voluntariado').then(result => result.data);
    return data;
};



export const getTotalVoluntariados = async () => {
  try {
      const voluntariados = await getVOluntariado(); 
      const total = voluntariados.length; 
      return total;
  } catch (error) {
      console.error(error);
      return 0; 
  }
};


export const getVOluntariadoID = async (id) => { 
    let data = await api.get(`voluntariado/${id}`).then(result => result.data);
    return data;
};


export const updateVOluntariado = async (newData) => { 
    
    console.log(newData);    
    
    let data = await api.put(`voluntariado-update/${newData.id}`, newData).then(result => result.data);
    return data;
};

export const create = async (voluntariado) => { 
    let data = await api.post('/create-voluntariado', voluntariado).then(result => result.data);
    return data;
};

export const eliminarVOluntariado = async (id) => {
  try {
      const response = await api.delete(`voluntariado-delete/${id}`);
      console.log(response.data);
  } catch (error) {
      if (error.response && error.response.status === 500) {
          throw new Error('Error: Usuario está ligado a otra tabla');
      } else {
          console.error(error);
      }
  } 
};

export const actualizarEstadoVoluntariado = async (id, newStatus) => {
    try {
      // Realizar la solicitud PUT para actualizar el estado del usuario
      const response = await api.put(`voluntariado-updateStatus/${id}`, {
        status: newStatus,
      });
      console.log('Respuesta del servidor:', response.data);

      // Devolver la respuesta del servidor
      return response.data;
    } catch (error) {
      // Manejar errores
      console.error(error);
    }
  }

