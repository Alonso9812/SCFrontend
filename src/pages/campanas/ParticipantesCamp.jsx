import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUsuCamp, EliminarUsuCamp } from "../../services/ParticipantesServicios";
import { getUsuarios } from "../../services/UsuariosServicios";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const ParticipantesCamp = () => {
  const { data, isLoading, isError, refetch } = useQuery(
    "mostrar-UsuCam",
    getUsuCamp,
    { enabled: true }
  );

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const usuariosData = await getUsuarios();
        setUsuarios(usuariosData);
      } catch (error) {
        console.error("Error al obtener la lista de usuarios:", error);
      }
    };
    fetchUsuarios();
  }, []);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleDeleteCandidate = async (id) => {
    try {
      await EliminarUsuCamp(id);
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

  if (isLoading) return <div className="loading">Loading...</div>;

  if (isError) return <div className="error">Error</div>;

  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice(offset, offset + itemsPerPage);

  return (
    <>
      <div className="type-registration">
        <h1 className="Namelist">Registro de Participantes</h1>
        <div className="Div-Table">
          <table className="Table custom-table">
            <thead>
              <tr>
                <th>ID UsuCamp</th>
                <th>ID Campaña</th>
                <th>Cedula Participante</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((UsuCamp) => (
                <tr key={UsuCamp.id}>
                  <td>{UsuCamp.id}</td>
                  <td>{UsuCamp.campaña_id}</td>
                  <td>
                      {usuarios.length > 0 ? (
                        usuarios.find((usuario) => usuario.id === UsuCamp.usuario_id) ? (
                          usuarios.find((usuario) => usuario.id === UsuCamp.usuario_id).cedula
                        ) : (
                          "Cédula No Encontrada"
                        )) : "Loading..."
                      }
                  </td>
                  <td>
                  <button onClick={() => handleDeleteConfirmation(UsuCamp.id)} className="btnEliminar">
                    <span style={{ color: 'black' }}> {/* Esto cambiará el color del icono a rojo */}
                      <FontAwesomeIcon icon="trash" />
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
            <button onClick={() => handleDeleteCandidate(deleteConfirm)}>Sí</button>
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

export default ParticipantesCamp;
