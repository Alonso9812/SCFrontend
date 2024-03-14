import api from "../api/config";


//UsuarioCampaña
export const getUsuCamp = async () => { 
    let data = await api.get('mostrar-UsuCamp').then(result => result.data);
    return data;
};


export const createUsuCamp = async (usuarioCampaña) => { 
    let data = await api.post('crear-UsuCamp', usuarioCampaña).then(result => result.data);
    return data;
};


export const EliminarUsuCamp = async (id) => {
    try {
        const response = await api.delete(`participacion-delete/${id}`);
        console.log(response.data);
    } catch (error) {
    
        console.error(error);
    } 
};



//UsuarioVoluntariado
export const getUsuVol = async () => { 
    let data = await api.get('mostrar-UsuVol').then(result => result.data);
    return data;
};


export const createUsuVol = async (tipoVolCamp) => { 
    let data = await api.post('crear-UsuVol', tipoVolCamp).then(result => result.data);
    return data;
};

export const EliminarUsuVol = async (id) => {
    try {
        const response = await api.delete(`participacionVol-delete/${id}`);
        console.log(response.data);
    } catch (error) {
    
        console.error(error);
    } 
};
