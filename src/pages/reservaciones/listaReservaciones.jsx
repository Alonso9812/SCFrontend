import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getReservaciones,
  eliminarReservacion,
  actualizarEstadoReservacion,
} from "../../services/ReservacionesServicios";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const ListaReservaciones = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery(
    "reservaciones",
    getReservaciones,
    { enabled: true }
  );
  const navigate = useNavigate();
  const [editConfirm, setEditConfirm] = useState(null);
  const [isEditConfirmationOpen, setIsEditConfirmationOpen] = useState(false);
  const [reservacionToDelete, setReservacionToDelete] = useState(null);
  const [confirmarVisible, setConfirmarVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleShowConfirmation = (id) => {
    setReservacionToDelete(id);
    setConfirmarVisible(true);
  };

  const handleHideConfirmar = () => {
    setReservacionToDelete(null);
    setConfirmarVisible(false);
  };

  const handleDeleteReservaciones = async () => {
    try {
      if (reservacionToDelete !== null) {
        await eliminarReservacion(reservacionToDelete);
        await queryClient.invalidateQueries("reservaciones");
        toast.success("¡Eliminada Exitosamente!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        handleHideConfirmar();
      }
    } catch (error) {
      console.error(error);
    }
  };

    const handleShowEditConfirmation = (id) => {
      setEditConfirm(id);
      setIsEditConfirmationOpen(true);
    };
    
    const handleHideEditConfirmation = () => {
      setIsEditConfirmationOpen(false);
    };
  
    const handleEditReservaciones = (id) => {
      handleShowEditConfirmation(id);
    };


    const handleStatusChange = async (id, newStatus) => {
      try {
        await actualizarEstadoReservacion(id, newStatus);
        await refetch();
        queryClient.invalidateQueries('usuarios');
        toast.success('¡Estado Actualizado Exitosamente!', { position: toast.POSITION.TOP_RIGHT });
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
      <div className="user-reservations">
        <h1 className="Namelist">Registro de Reservaciones</h1>
        <Link to="/crear-reservacion-admin">
          <button className="btnRegistrarAdmin">Crear Reservacion</button>
        </Link>
        <div className="Div-Table scrollable-table">
          <table className="Table custom-table">
            <thead>
              <tr>
                <th>ID Reservaciones</th>
                <th>Nombre Visitante</th>
                <th>Primer Apellido</th>
                <th>Segundo Apellido</th>
                <th>Cédula Visitante</th>
                <th>Fecha de Reserva</th>
                <th>Cupo</th>
                <th>Teléfono Visitante</th>
                <th>Email</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((reservaciones) => (
                <tr key={reservaciones.id}>
                  <td>{reservaciones.id}</td>
                  <td>{reservaciones.nombreVis}</td>
                  <td>{reservaciones.apell1Vis}</td>
                  <td>{reservaciones.apell2Vis}</td>
                  <td>{reservaciones.cedulaVis}</td>
                  <td>{reservaciones.fechaReserva}</td>
                  <td>{reservaciones.cupo}</td>
                  <td>{reservaciones.telefonoVis}</td>
                  <td>{reservaciones.email}</td>
                  <td><div className="select-container">
                      <label htmlFor={`status-${reservaciones.id}`}>Estado:</label>
                      <select
                        id={`status-${reservaciones.id}`}
                        value={reservaciones.status}
                        onChange={(e) => handleStatusChange(reservaciones.id, e.target.value)}
                        
                      >
                        <option value="Nueva">Nueva</option>
                        <option value="Cancelada">Cancelada</option>
                        <option value="En Proceso">En Proceso</option>
                        <option value="Terminada">Terminada</option>
                      </select>
                    </div></td>
                  <td>
                  <button onClick={() => handleShowConfirmation(reservaciones.id)} className="btnEliminar">
                    <span style={{ color: 'black' }}> {/* Esto cambiará el color del icono a rojo */}
                      <FontAwesomeIcon icon="trash" />
                    </span>
                  </button>
                  <button onClick={() =>  handleEditReservaciones(reservaciones.id)} className="btnModificar">
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
      {confirmarVisible && (
        <div className="overlay">
          <div className="delete-confirm">
            <p>¿Estás seguro de que deseas eliminar esta reservación?</p>
            <button
              onClick={handleDeleteReservaciones}
              className="btn-confirm btn-yes"
            >
              Sí
            </button>
            <button
              onClick={handleHideConfirmar}
              className="btn-confirm btn-no"
            >
              No
            </button>
          </div>
          
        </div>
      )}
      {isEditConfirmationOpen && (
                              <div className="overlay">
                                <div className="edit-confirm">
                                  <p>¿Estás seguro de que deseas editar esta reservación?</p>
                                  <button onClick={() => {
                                    handleHideEditConfirmation();
                                    navigate(`/reservaciones-update/${editConfirm}`);
                                  }} className="btn-confirm btn-yes">Sí</button>
                                  <button onClick={handleHideEditConfirmation} className="btn-confirm btn-no">No</button>
                                </div>
                              </div>
                            )}
    </>
  );
};

export default ListaReservaciones;
