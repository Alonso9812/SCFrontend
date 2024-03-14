import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { getUsuarios, ELiminarUsuario, actualizarEstadoUsuario } from '../../services/UsuariosServicios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';

const ListUsuarios = () => {
  const { data, isLoading, isError, refetch } = useQuery(
    'usuarios',
    getUsuarios,
    { enabled: true }
  );
  const navigate = useNavigate();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;
  const queryClient = useQueryClient();
  const [editConfirm, setEditConfirm] = useState(null);
  const [isEditConfirmationOpen, setIsEditConfirmationOpen] = useState(false);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleDeleteUsuario = async (id) => {
    try {
      await ELiminarUsuario(id);
      await refetch();
      queryClient.invalidateQueries('usuarios');
      toast.success('¡Eliminado Exitosamente!', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error(error);
    }
    setDeleteConfirm(null);
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteConfirm(id);
  };

   const handleShowEditConfirmation = (id) => {
      setEditConfirm(id);
      setIsEditConfirmationOpen(true);
    };
    
    const handleHideEditConfirmation = () => {
      setIsEditConfirmationOpen(false);
    };
  
    const handleEditUsuario = (id) => {
      handleShowEditConfirmation(id);
    };

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Llamada a la función que actualiza el estado del usuario
      await actualizarEstadoUsuario(id, newStatus);
      // Recargar la lista de usuarios después de la actualización
      await refetch();
      queryClient.invalidateQueries('usuarios');
      toast.success('¡Estado Actualizado Exitosamente!', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <div className="loading">Loading...</div>;

  if (isError) return <div className="error">Error</div>;

  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(data.length / itemsPerPage);
  const filteredData = data.filter(user =>
    user.cedula.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const currentData = filteredData.slice(offset, offset + itemsPerPage);

  return (
    <>
      <div className="user-registration">
        <h1 className="Namelist">Registro de Usuarios</h1>
        <Link to="/agregar-usuario-admin" className="btnRegistrarAdmin">
          Crear Usuario
        </Link>

        <div className="filter-container">
          <input
            type="text"
            placeholder="Buscar por Cedula..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='filter'
          />
        </div>

        <div className="Div-Table scrollable-table">
          <table className="Table custom-table">
            <thead>
              <tr>
                <th>ID Usuario</th>
                <th>Nombre</th>
                <th>Primer Apellido</th>
                <th>Segundo Apellido</th>
                <th>Cédula</th>
                <th>Número</th>
                <th>Ocupación</th>
                <th>Rol</th>
                <th>Correo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.apell1}</td>
                  <td>{usuario.apell2}</td>
                  <td>{usuario.cedula}</td>
                  <td>{usuario.numero}</td>
                  <td>{usuario.ocupacion}</td>
                  <td>{usuario.rol}</td>
                  <td>{usuario.email}</td>
                  <td>
                    {/* ComboBox para editar el estado */}
                    <select
                      value={usuario.status}
                      onChange={(e) => handleStatusChange(usuario.id, e.target.value)}
                      style={{
                        backgroundColor: usuario.status === 'Activo' ? 'green' : 'lightgray',
                        color: usuario.status === 'Activo' ? 'white' : 'black',
                        borderRadius: '5px'
                      }}
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteConfirmation(usuario.id)}
                      className="btnEliminar"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => handleEditUsuario(usuario.id)}
                      className="btnModificar"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ToastContainer />
      </div>

      {deleteConfirm !== null && (
        <div className="overlay">
          <div className="delete-confirm">
            <p>¿Estás seguro de que quieres eliminar este usuario?</p>
            <button onClick={() => handleDeleteUsuario(deleteConfirm)}>Sí</button>
            <button onClick={() => setDeleteConfirm(null)}>No</button>
          </div>
        </div>
      )}

      {isEditConfirmationOpen && (
            <div className="overlay">
              <div className="edit-confirm">
                <p>¿Estás seguro de que deseas editar este usuario?</p>
                <button onClick={() => {
                  handleHideEditConfirmation();
                  navigate(`/user-update/${editConfirm}`);
                }} className="btn-confirm btn-yes">Sí</button>
                <button onClick={handleHideEditConfirmation} className="btn-confirm btn-no">No</button>
              </div>
            </div>
          )}

      <ReactPaginate
        previousLabel={'Anterior'}
        nextLabel={'Siguiente'}
        breakLabel={'...'}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
    </>
  );
};

export default ListUsuarios;

