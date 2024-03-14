import api from "../api/config";

export const getSolicitudes = async () => { 
    let data = await api.get('mostrar-solicitudes').then(result => result.data);
    return data;
};

export const getSolicitudID = async (id) => { 
    let data = await api.get(`ver-tipo/${id}`).then(result => result.data);
    return data;
};

export const create = async (solicitudes) => { 
    let data = await api.post('crear-solicitud', solicitudes).then(result => result.data);
    return data;
};


export const eliminarSolicitud= async (id) => {
    try {
        const response = await api.delete(`solicitud-delete/${id}`);
        console.log(response.data);
    } catch (error) {
    
        console.error(error);
    } 
};