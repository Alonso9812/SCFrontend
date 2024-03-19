
import { useState, useEffect} from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { toast, ToastContainer } from 'react-toastify';
import { useNavigate , Link} from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { getCampaña, eliminarCampana, actualizarEstadoCampana } from '../../services/CampanasServicios';
import { getTipos } from '../../services/TiposServicios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const ListaCampanas = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useQuery('campana', getCampaña, { enabled: true });

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;
  const queryClient = useQueryClient();
  const [editConfirm, setEditConfirm] = useState(null);
  const [isEditConfirmationOpen, setIsEditConfirmationOpen] = useState(false);


  const [Tipos, setTipo] = useState([]);

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

  const handleShowConfirmation = (id) => {
    setDeleteConfirm(id);
    setIsConfirmationOpen(true);
  };

  const handleHideConfirmation = () => {
    setIsConfirmationOpen(false);
  };

  const handleShowEditConfirmation = (id) => {
    setEditConfirm(id);
    setIsEditConfirmationOpen(true);
  };
  
  const handleHideEditConfirmation = () => {
    setIsEditConfirmationOpen(false);
  };

  const handleEditCampaña = (id) => {
    handleShowEditConfirmation(id);
  };
  

  const handleDeleteCampaña = async () => {
    try {
      await eliminarCampana(deleteConfirm);
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

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Llamada a la función que actualiza el estado del usuario
      await actualizarEstadoCampana(id, newStatus);
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
 

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

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
        <h1 className="Namelist">Registro de Campañas</h1>
        <Link to='/dashboard/crear-campana-admin'>
        <button className="btnRegistrarAdmin">Crear Campaña</button>
        </Link>

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
          <table className="Table custom-table" >
            <thead>
              <tr>
                <th>ID Campaña</th>
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
              {currentData.map((campanas) => (
                <tr key={campanas.id}>
                  <td>{campanas.id}</td>
                  <td>{campanas.nombre}</td>
                  <td>{campanas.descripcion}</td>
                  <td>{campanas.ubicacion}</td>
                  <td>{campanas.fecha}</td>
                  <td>{campanas.alimentacion}</td>
                  <td>{campanas.capacidad}</td>
                  <td>
                    {Tipos.length > 0 ? 
                      (Tipos.find((tipos) => tipos.id === campanas.tipo)?.nombreTipo || "NombreTipoNoEncontrado")
                      : "Loading..."}
                  </td>

                  <td>{campanas.inOex}</td>
                  <td>
                    {/* ComboBox para editar el estado */}
                    <select
                      value={campanas.status}
                      onChange={(e) => handleStatusChange(campanas.id, e.target.value)}
                      style={{
                        backgroundColor: campanas.status === 'Activo' ? 'green' : 'lightgray',
                        color: campanas.status === 'Activo' ? 'white' : 'black',
                        borderRadius: '5px'
                      }}
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </td>
                  <td>
                  <button onClick={() => handleShowConfirmation(campanas.id)} className="btnEliminar">
                    <span style={{ color: 'black' }}> {/* Esto cambiará el color del icono a rojo */}
                      <FontAwesomeIcon icon="trash" />
                    </span>
                  </button>
                  <button onClick={() =>  handleEditCampaña(campanas.id)} className="btnModificar">
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
            <p>¿Estás seguro de que deseas eliminar esta campaña?</p>
            <button onClick={handleDeleteCampaña} className="btn-confirm btn-yes">Sí</button>
            <button onClick={handleHideConfirmation} className="btn-confirm btn-no">No</button>
          </div>
        </div>
      )}


        {/* Modal de confirmación para editar */}
        {isEditConfirmationOpen && (
          <div className="overlay">
            <div className="edit-confirm">
              <p>¿Estás seguro de que deseas editar esta campaña?</p>
              <button onClick={() => {
                handleHideEditConfirmation();
                navigate(`/dashboard/campana-update/${editConfirm}`);
              }} className="btn-confirm btn-yes">Sí</button>
              <button onClick={handleHideEditConfirmation} className="btn-confirm btn-no">No</button>
            </div>
          </div>
        )}

      {/* Estilos en línea */}
      <style>
        
      </style>
    </>
  );
};

export default ListaCampanas;