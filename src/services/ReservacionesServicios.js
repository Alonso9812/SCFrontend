import api from "../api/config";

export const getReservaciones = async () => { 
    let data = await api.get('reservaciones').then(result => result.data);
    return data;
};

export const getTotalReservaciones = async () => {
    try {
        const reservaciones = await getReservaciones();
        const reservacionesNuevas = reservaciones.filter(reservacion => reservacion.status === 'nueva');
        const total = reservacionesNuevas.length;
        return total;
    } catch (error) {
        console.error(error);
        return 0; 
    }
}

export const getReservacionesID = async (id) => { 
    let data = await api.get(`reservaciones/${id}`).then(result => result.data);
    return data;
};

export const create = async (reservaciones) => { 
    let data = await api.post('create-reservacion', reservaciones).then(result => result.data);
    return data;
};

export const destroy = async (reservaciones) => { 
    let data = await api.delete('destroy-reservacion', reservaciones).then(result => result.data);
    return data;
};

export const eliminarReservacion= async (id) => {
    try {
        const response = await api.delete(`reservaciones-delete/${id}`);
        console.log(response.data);
    } catch (error) {
    
        console.error(error);
    } 
};

export const actualizarEstadoReservacion = async (id, newStatus) => {
    try {
      // Realizar la solicitud PUT para actualizar el estado del usuario
        const response = await api.put(`reservacion-status/${id}`, {
            status: newStatus,
        });
    
        // Devolver la respuesta del servidor
        return response.data;
        } catch (error) {
        // Manejar errores
        console.error(error);
        }
    }

export const updateReserva = async (newData) => { 
    
    // En este punto, `newData` debe ser un objeto con los datos de la reserva  a actualizar
    let data = await api.put(`reservaciones-update/${newData.id}`, newData).then(result => result.data);
    return data;
};
