
import { useState } from "react";
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate , Link} from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getTipos, eliminarTipo, actualizarEstadoTipo } from "../../services/TiposServicios";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const ListaTipos = () => {
  const { data, isLoading, isError, refetch } = useQuery(
    "ver-tipo",
    getTipos,
    { enabled: true }
  );
  const navigate = useNavigate();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const queryClient = useQueryClient();
  const [editConfirm, setEditConfirm] = useState(null);
  const [isEditConfirmationOpen, setIsEditConfirmationOpen] = useState(false);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleDeleteCandidate = async (id) => {
    try {
      await eliminarTipo(id);
      await refetch();
      toast.success("¡Eliminado Exitosamente!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error("Error en la solicitud Axios:", error);
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
    
      const handleEditTipo = (id) => {
        handleShowEditConfirmation(id);
      };
  
  const handleStatusChange = async (id, newStatus) => {
    try {
      // Llamada a la función que actualiza el estado del usuario
      await actualizarEstadoTipo(id, newStatus);
      // Recargar la lista de usuarios después de la actualización
      await refetch();
      queryClient.invalidateQueries('tipos');
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
  const currentData = data.slice(offset, offset + itemsPerPage);

  return (
    <>
      <div className="type-registration">
        
        
        <h1 className="Namelist">Registro de tipos para campañas y voluntariados</h1>
        <Link to="/dashboard/agregar-tipo-admin">
        <button className="btnRegistrarAdmin" >Crear Tipo</button>
        </Link>
        <div className="Div-Table scrollable-table">
          <table className="Table custom-table">
            <thead>
              <tr>
                <th>ID Tipo</th>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((tipo) => (
                <tr key={tipo.id}>
                  <td>{tipo.id}</td>
                  <td>{tipo.nombreTipo}</td>
                  <td>
                    {/* ComboBox para editar el estado */}
                    <select
                      value={tipo.statusVC}
                      onChange={(e) => handleStatusChange(tipo.id, e.target.value)}
                      style={{
                        backgroundColor: tipo.statusVC === 'Activo' ? 'green' : 'lightgray',
                        color: tipo.statusVC === 'Activo' ? 'white' : 'black',
                        borderRadius: '5px'
                      }}
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </td>
                  <td>
                  <button onClick={() => handleDeleteConfirmation(tipo.id)} className="btnEliminar">
                    <span style={{ color: 'black' }}> {/* Esto cambiará el color del icono a rojo */}
                      <FontAwesomeIcon icon="trash" />
                    </span>
                  </button>
                  <button onClick={() =>  handleEditTipo(tipo.id)} className="btnModificar">
                    <span style={{ color: 'black' }}> {/* Esto cambiará el color del icono a amarillo */}
                      <FontAwesomeIcon icon="edit" />
                    </span>
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
            <p>¿Estás seguro de que quieres eliminar este tipo?</p>
            <button onClick={() => handleDeleteCandidate(deleteConfirm)}>
              Sí
            </button>
            <button onClick={() => setDeleteConfirm(null)}>No</button>
          </div>
        </div>
      )}
    {isEditConfirmationOpen && (
      <div className="overlay">
        <div className="edit-confirm">
          <p>¿Estás seguro de que deseas editar este tipo?</p>
          <button onClick={() => {
            handleHideEditConfirmation();
            navigate(`/dashboard/update-tipo/${editConfirm}`);
          }} className="btn-confirm btn-yes">Sí</button>
          <button onClick={handleHideEditConfirmation} className="btn-confirm btn-no">No</button>
        </div>
      </div>
    )}

      <ReactPaginate
        previousLabel={"Anterior"}
        nextLabel={"Siguiente"}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </>
  );
};

export default ListaTipos;
