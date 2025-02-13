import api from "../api/config";

export const getCampaña = async () => { 
    let data = await api.get('mostrar-campanas').then(result => result.data);
    return data;
};

export const getTotalCampanas = async () => {
  try {
      const campanas = await getCampaña();
      const campanasNuevas = campanas.filter(campanas => campanas.status === 'Activo');
      const total = campanasNuevas.length;
      return total;
  } catch (error) {
      console.error(error);
      return 0; 
  }
}

export const getCampañaID = async (id) => { 
    let data = await api.get(`campana/${id}`).then(result => result.data);
    return data;
};


export const updateCampaña = async (newData) => { 
    
    console.log(newData);    
    
    let data = await api.put(`campana-update/${newData.id}`, newData).then(result => result.data);
    return data;
};

export const create = async (campaña) => { 
    let data = await api.post('create-campana', campaña).then(result => result.data);
    return data;
};

export const eliminarCampana = async (id) => {
  try {
      const response = await api.delete(`campana-delete/${id}`);
      console.log(response.data);
  } catch (error) {
      if (error.response && error.response.status === 500) {
          throw new Error('Error: La campaña está ligada a otra tabla');
      } else {
          console.error(error);
      }
  } 
};

    export const actualizarEstadoCampana = async (id, newStatus) => {
        try {
          // Realizar la solicitud PUT para actualizar el estado del usuario
          const response = await api.put(`Status-update/${id}`, {
            status: newStatus,
          });
      
          // Devolver la respuesta del servidor
          return response.data;
        } catch (error) {
          // Manejar errores
          console.error(error);
        }
      }
  