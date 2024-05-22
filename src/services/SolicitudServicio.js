import api from "../api/config";

export const getSolicitudes = async () => { 
    let data = await api.get('mostrar-solicitudes').then(result => result.data);
    return data;
};

export const getTotalSolicitudes = async () => {
    try {
        const solicitudes = await getSolicitudes();
        const solicitudesNuevas = solicitudes.filter(solicitud => solicitud.statusSoli === 'Nueva');
        const total = solicitudesNuevas.length;
        return total;
    } catch (error) {
        console.error(error);
        return 0; 
    }
}

export const getSolicitudID = async (id) => { 
    let data = await api.get(`ver-tipo/${id}`).then(result => result.data);
    return data;
};

export const create = async (solicitudes) => { 
    let data = await api.post('crear-solicitud', solicitudes).then(result => result.data);
    return data;
};
export const actualizarEstadoSolicitud = async (id, newStatus) => {
    try {
      // Realizar la solicitud PUT para actualizar el estado del usuario
        const response = await api.put(`solicitud-status/${id}`, {
            statusSoli: newStatus,
        });
    
        // Devolver la respuesta del servidor
        return response.data;
        } catch (error) {
        // Manejar errores
        console.error(error);
        }
    }

export const eliminarSolicitud= async (id) => {
    try {
        const response = await api.delete(`solicitud-delete/${id}`);
        console.log(response.data);
    } catch (error) {
    
        console.error(error);
    } 
};