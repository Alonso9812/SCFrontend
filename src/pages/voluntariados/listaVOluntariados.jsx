import { useState , useEffect} from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate , Link} from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { getVOluntariado, eliminarVOluntariado, actualizarEstadoVoluntariado } from '../../services/VOluntariadosServicios';
import { getTipos } from '../../services/TiposServicios';

const ListaVoluntariados = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useQuery('mostrar-voluntariado', getVOluntariado, { enabled: true });
  const [editConfirm, setEditConfirm] = useState(null);
  const [isEditConfirmationOpen, setIsEditConfirmationOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;
  const queryClient = useQueryClient();


  const [Tipos, setTipo] = useState([]);


  const handleShowConfirmation = (id) => {
    setDeleteConfirm(id);
    setIsConfirmationOpen(true);
  };

  const handleHideConfirmation = () => {
    setIsConfirmationOpen(false);
  };

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const TiposData = await getTipos();
        setTipo(TiposData);
      } catch (error) {
        console.error('Error al obtener la lista de tipos:', error);
      }
    };

    fetchTipos();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Llamada a la función que actualiza el estado del usuario
      await actualizarEstadoVoluntariado(id, newStatus);
      // Recargar la lista de usuarios después de la actualización
      await refetch();
      queryClient.invalidateQueries('campana');
      toast.success('¡Estado Actualizado Exitosamente!', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteVOluntariado = async () => {
    try {
      await eliminarVOluntariado(deleteConfirm);
      await refetch();
      toast.success('¡Eliminada Exitosamente!', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar: ' + error.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    setIsConfirmationOpen(false);
  };

  const handleShowEditConfirmation = (id) => {
          setEditConfirm(id);
          setIsEditConfirmationOpen(true);
        };
        
        const handleHideEditConfirmation = () => {
          setIsEditConfirmationOpen(false);
        };
      
        const handleEditVOluntariado = (id) => {
          handleShowEditConfirmation(id);
        };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

    // Filtrar tipos activos
  

  if (isLoading) return <div className="loading">Loading...</div>;

  if (isError) return <div className="error">Error</div>;

  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(data.length / itemsPerPage);
  const filteredData = data.filter(camp =>
    camp.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const currentData = filteredData.slice(offset, offset + itemsPerPage);

  return (
    <>
      <div className="campaign-registration">
        <h1 className="Namelist">Registro de Voluntariados</h1>
       
          <Link to="/nuevo-voluntariados-admin"><button className="btnRegistrarAdmin">Crear Voluntariado</button></Link>

          
        <div className="filter-container">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='filter'
          />
        </div>
        <div className="Div-Table scrollable-table">
          <table className="Table custom-table">
            <thead>
              <tr>
                <th>ID Voluntariado</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Ubicación</th>
                <th>Fecha</th>
                <th>Alimentación</th>
                <th>Capacidad</th>
                <th>Tipo</th>
                <th>Interna o Externa</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((voluntariados) => (
                <tr key={voluntariados.id}>
                  <td>{voluntariados.id}</td>
                  <td>{voluntariados.nombre}</td>
                  <td>{voluntariados.descripcion}</td>
                  <td>{voluntariados.ubicacion}</td>
                  <td>{voluntariados.fecha}</td>
                  <td>{voluntariados.alimentacion}</td>
                  <td>{voluntariados.capacidad}</td>
                  <td>
                    {Tipos.length > 0 ? 
                      (Tipos.find((tipos) => tipos.id === voluntariados.tipo)?.nombreTipo || "NombreTipoNoEncontrado")
                      : "Loading..."}
                  </td>
                  <td>{voluntariados.inOex}</td>
                  <td>
                    {/* ComboBox para editar el estado */}
                    <select
                      value={voluntariados.status}
                      onChange={(e) => handleStatusChange(voluntariados.id, e.target.value)}
                      style={{
                        backgroundColor: voluntariados.status === 'Activo' ? 'green' : 'lightgray',
                        color: voluntariados.status === 'Activo' ? 'white' : 'black',
                        borderRadius: '5px'
                      }}
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => handleShowConfirmation(voluntariados.id)} className="btnEliminar">
                      Eliminar
                    </button>
                    <button onClick={() => handleEditVOluntariado(voluntariados.id)} className="btnModificar">
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

      {/* Paginación */}
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

      {/* Modal de confirmación */}
      {isConfirmationOpen && (
        <div className="overlay">
          <div className="delete-confirm">
            <p>¿Estás seguro de que deseas eliminar este voluntariado?</p>
            <button onClick={handleDeleteVOluntariado} className="btn-confirm btn-yes">Sí</button>
            <button onClick={handleHideConfirmation} className="btn-confirm btn-no">No</button>
          </div>
        </div>
      )}

    {isEditConfirmationOpen && (
        <div className="overlay">
          <div className="edit-confirm">
            <p>¿Estás seguro de que deseas editar este voluntariado?</p>
            <button onClick={() => {
              handleHideEditConfirmation();
              navigate(`/voluntariado-update/${editConfirm}`);
            }} className="btn-confirm btn-yes">Sí</button>
            <button onClick={handleHideEditConfirmation} className="btn-confirm btn-no">No</button>
          </div>
        </div>
    )}
      
    </>
  );
};

export default ListaVoluntariados;