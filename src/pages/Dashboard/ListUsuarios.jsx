import { useState } from "react";
import { useQuery } from "react-query";
import { getUsuarios, ELiminarUsuario } from "../../services/UsuariosServicios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListUsuarios = () => {
    const { data, isLoading, isError, refetch } = useQuery('usuarios', getUsuarios, { enabled: true });
    const navigate = useNavigate();
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const handleDeleteCandidate = async (id) => {
        try {
            await ELiminarUsuario(id);
            await refetch();
            // Aquí puedes actualizar la lista de candidatos después de eliminar uno
            toast.success('¡Eliminado Exitosamente!', {
                position: toast.POSITION.TOP_RIGHT
            });
        } catch (error) {
            // Aquí puedes manejar el error en caso de que ocurra
            console.error(error);
        }
        setDeleteConfirm(null); // Cerrar el cuadro de confirmación después de eliminar
    };

    const handleDeleteConfirmation = (id) => {
        setDeleteConfirm(id); // Mostrar el cuadro de confirmación antes de eliminar
    };

    const handleEditUsuario = (id) => {
        // Redirigir al usuario a la página de edición con el ID del usuario como parámetro en la URL
        navigate(`/user-update/${id}`);
    };

    if (isLoading)
        return <div className="loading">Loading...</div>

    if (isError)
        return <div className="error">Error</div>

    return (
        <>
            <h1 className="Namelist">Registro Usuarios</h1>
            <div className="Div-Table">
                <table border="1" className="TableUsuarios" style={{ width: '50%', textAlign: 'center' }}>
                    <tbody>
                        <tr>
                            <td>ID Usuario</td>
                            <td>Nombre</td>
                            <td>Primer Apellido</td>
                            <td>Segundo Apellido</td>
                            <td>Cedula</td>
                            <td>Numero</td>
                            <td>Ocupacion</td>
                            <td>Rol</td>
                            <td>Correo</td>
                            <td>Estado</td>
                            <td>Acciones</td>
                        </tr>
                        {
                            data.map((usuarios) => (
                                <tr key={usuarios.id}>
                                    <td>{usuarios.id}</td>
                                    <td>{usuarios.nombre}</td>
                                    <td>{usuarios.apell1}</td>
                                    <td>{usuarios.apell2}</td>
                                    <td>{usuarios.cedula}</td>
                                    <td>{usuarios.numero}</td>
                                    <td>{usuarios.ocupacion}</td>
                                    <td>{usuarios.rol}</td>
                                    <td>{usuarios.email}</td>
                                    <td>{usuarios.status}</td>
                                    <td>
                                        <button onClick={() => handleDeleteConfirmation(usuarios.id)} className="btnEliminar"><FontAwesomeIcon icon={faTrashAlt} /></button>
                                        <button onClick={() => handleEditUsuario(usuarios.id)} className="btnModificar"><FontAwesomeIcon icon={faFolderPlus} /></button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <ToastContainer />
            </div>
            {deleteConfirm !== null && (
                <div className="overlay">
                    <div className="delete-confirm">
                    <p>¿Estás seguro de que quieres eliminar este usuario?</p>
                    <button onClick={() => handleDeleteCandidate(deleteConfirm)}>Sí</button>
                    <button onClick={() => setDeleteConfirm(null)}>No</button>
                    </div>
                </div>
            )}
        </>
    )
}

export default ListUsuarios;
