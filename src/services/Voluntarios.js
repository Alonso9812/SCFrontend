
import api from "../api/config";

export const getVoluntarios = async () => { 
    let data = await api.get('voluntarios').then(result => result.data);
    return data;
};

export const create = async (voluntarios) => { 
    let data = await api.post('/create-voluntarios', voluntarios).then(result => result.data);
    return data;
};
