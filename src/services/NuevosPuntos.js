
import api from "../api/config";

export const getPuntosDIS = async () => { 
    let data = await api.get('Puntos').then(result => result.data);
    return data;
};

export const eliminarPunto= async (id) => {
    try {
        const response = await api.delete(`delete-punto/${id}`);
        console.log(response.data);
    } catch (error) {
    
        console.error(error);
    } 
};

export const getPuntoID = async (id) => { 
    let data = await api.get(`Puntos/${id}`).then(result => result.data);
    return data;
};

export const updatePunto = async (newData) => { 
    
    console.log(newData);    
    // En este punto, `newData` debe ser un objeto con los datos de la reserva  a actualizar
    let data = await api.put(`update-punto/${newData.id}`, newData).then(result => result.data);
    return data;
};


export const actualizarEstadoPunto = async (id, newStatus) => {
    try {
      // Realizar la solicitud PUT para actualizar el estado del usuario
      const response = await api.put(`Punto-status/${id}`, {
        statusPunto: newStatus,
      });
      console.log('Respuesta del servidor:', response.data);

      // Devolver la respuesta del servidor
      return response.data;
    } catch (error) {
      // Manejar errores
      console.error(error);
    }
  }