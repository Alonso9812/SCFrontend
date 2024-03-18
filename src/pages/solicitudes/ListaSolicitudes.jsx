import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSolicitudes, eliminarSolicitud } from "../../services/SolicitudServicio";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const ListaSolicitudes = () => {
  const { data, isLoading, isError, refetch } = useQuery(
    "mostrar-solicitudes",
    getSolicitudes,
    { enabled: true }
  );
  const navigate = useNavigate();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleDeleteSolicitud = async (id) => {
    try {
      await eliminarSolicitud(id);
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

  const handleEditTipo = (id) => {
    navigate(`/update-tipo/${id}`);
  };

  if (isLoading) return <div className="loading">Loading...</div>;

  if (isError) return <div className="error">Error</div>;

  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice(offset, offset + itemsPerPage);

  return (
    <>
      <div className="type-registration">
        <h1 className="Namelist">Registro de solicitudes</h1>
        <div className="Div-Table scrollable-table">
          <table className="Table custom-table">
            <thead>
              <tr>
                <th>ID Solicitud</th>
                <th>Nombre Solicitante</th>
                <th>Primer Apellido</th>
                <th>Segundo apellido</th>
                <th>Numero</th>
                <th>Correo</th>
                <th>Titulo Solicitud</th>
                <th>Descripcion</th>
                <th>Lugar</th>
                <th>Alimentacion</th>
                <th>Tipo Solicitud</th>
                <th>Fecha solicitada</th>
                <th>Estado</th>
                <th>acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((solicitudes) => (
                <tr key={solicitudes.id}>
                  <td>{solicitudes.id}</td>
                  <td>{solicitudes.nomSoli}</td>
                  <td>{solicitudes.apellSoli1}</td>
                  <td>{solicitudes.apellSoli2}</td>
                  <td>{solicitudes.numSoli}</td>
                  <td>{solicitudes.email}</td>
                  <td>{solicitudes.tituloVC}</td>
                  <td>{solicitudes.descripVC}</td>
                  <td>{solicitudes.lugarVC}</td>
                  <td>{solicitudes.alimentacion}</td>
                  <td>{solicitudes.tipoSoli}</td>
                  <td>{solicitudes.fechaSoli}</td>
                  <td>{solicitudes.statusSoli}</td>
                  <td>
                  <button onClick={() => handleDeleteConfirmation(solicitudes.id)} className="btnEliminar">
                    <span style={{ color: 'black' }}> {/* Esto cambiará el color del icono a rojo */}
                      <FontAwesomeIcon icon="trash" />
                    </span>
                  </button>
                  <button onClick={() =>  handleEditTipo(solicitudes.id)} className="btnModificar">
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
            <button onClick={() => handleDeleteSolicitud(deleteConfirm)}>
              Sí
            </button>
            <button onClick={() => setDeleteConfirm(null)}>No</button>
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

export default ListaSolicitudes;
