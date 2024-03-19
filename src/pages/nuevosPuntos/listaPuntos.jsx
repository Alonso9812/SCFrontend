import { useState} from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getPuntosDIS, eliminarPunto, actualizarEstadoPunto } from '../../services/NuevosPuntos';
import { useNavigate , Link, } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { toast, ToastContainer } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const ListaPuntos = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery('Puntos', getPuntosDIS, { enabled: true });
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [editConfirm, setEditConfirm] = useState(null);
    const [isEditConfirmationOpen, setIsEditConfirmationOpen] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const itemsPerPage = 4;

  // Define la función para eliminar un punto de interés
  const { mutate: eliminarPuntoMutation } = useMutation(eliminarPunto, {
    onSuccess: () => {
      // Actualiza la lista de puntos de interés después de la eliminación
      queryClient.invalidateQueries('Puntos');
    },
  });


    const handleShowConfirmation = (id) => {
      setDeleteConfirm(id);
      setIsConfirmationOpen(true);
    };
  
    const handleHideConfirmation = () => {
      setIsConfirmationOpen(false);
    };
  

  const handleDeletePunto = async () => {
      try {
        await eliminarPuntoMutation(deleteConfirm);
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
      
        const handleEditPunto = (id) => {
          handleShowEditConfirmation(id);
        };

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Llamada a la función que actualiza el estado del usuario
      await actualizarEstadoPunto(id, newStatus);
      // Recargar la lista de usuarios después de la actualización
      await refetch();
      queryClient.invalidateQueries('Puntos');
      toast.success('¡Estado Actualizado Exitosamente!', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error(error);
    }
  };


  if (isLoading) return <div className="loading">loading...</div>;

  if (isError) return <div className="error">Error</div>;
  
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(data.length / itemsPerPage);
  const filteredData = data.filter(camp =>
    camp.nombrePunto.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const currentData = filteredData.slice(offset, offset + itemsPerPage);



  return (
    <>
      <div className="type-registration">
        <h1 className="Namelist">Lista Puntos De Interés Sostenible</h1>
        <Link to='/dashboard/nuevo-punto-admin'>
        <button className='btnRegistrarAdmin'>Crear Punto</button></Link>

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
                <th>ID Punto</th>
                <th>Nombre Punto</th>
                <th>Descripción</th>
                <th>Ubicación</th>
                <th>Imagen</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((Puntos) => (
                <tr key={Puntos.id}>
                  <td>{Puntos.id}</td>
                  <td>{Puntos.nombrePunto}</td>
                  <td>{Puntos.descripcionPunto}</td>
                  <td>{Puntos.ubicacionPunto}</td>
                  <td>
                  <img
                    src={`http://127.0.0.1:8000/storage/galeria/${Puntos.galeria}`}
                    alt={Puntos.galeria}
                    className='img-responsive'
                  
                  />
                </td>
                  <td>
                    {/* ComboBox para editar el estado */}
                    <select
                      value={Puntos.statusPunto}
                      onChange={(e) => handleStatusChange(Puntos.id, e.target.value)}
                      style={{
                        backgroundColor: Puntos.statusPunto === 'Activo' ? 'green' : 'lightgray',
                        color: Puntos.statusPunto === 'Activo' ? 'white' : 'black',
                        borderRadius: '5px'
                      }}
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </td>
                  <td>
                  <button onClick={() => handleShowConfirmation(Puntos.id)} className="btnEliminar">
                    <span style={{ color: 'black' }}> {/* Esto cambiará el color del icono a rojo */}
                      <FontAwesomeIcon icon="trash" />
                    </span>
                  </button>
                  <button onClick={() =>  handleEditPunto(Puntos.id)} className="btnModificar">
                    <span style={{ color: 'black' }}> {/* Esto cambiará el color del icono a amarillo */}
                      <FontAwesomeIcon icon="edit" />
                    </span>
                  </button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ToastContainer />
      </div>

    {isConfirmationOpen && (
        <div className="overlay">
          <div className="delete-confirm">
            <p>¿Estás seguro de que deseas eliminar este punto de interes?</p>
            <button onClick={handleDeletePunto} className="btn-confirm btn-yes">Sí</button>
            <button onClick={handleHideConfirmation} className="btn-confirm btn-no">No</button>
          </div>
        </div>
      )}

      {isEditConfirmationOpen && (
              <div className="overlay">
                <div className="edit-confirm">
                  <p>¿Estás seguro de que deseas editar este punto de interes?</p>
                  <button onClick={() => {
                    handleHideEditConfirmation();
                    navigate(`/dashboard/update-punto/${editConfirm}`);
                  }} className="btn-confirm btn-yes">Sí</button>
                  <button onClick={handleHideEditConfirmation} className="btn-confirm btn-no">No</button>
                </div>
              </div>
          )}

      <ReactPaginate
        previousLabel={"<"}
        nextLabel={">"}
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

export default ListaPuntos;
