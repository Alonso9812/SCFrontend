import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUsuVol, EliminarUsuVol } from "../../services/ParticipantesServicios";
import ReactPaginate from "react-paginate";
import { getUsuarios } from '../../services/UsuariosServicios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ParticipantesVol = () => {
  const { data, isLoading, isError, refetch } = useQuery(
    "mostrar-UsuVol",
    getUsuVol,
    { enabled: true }
  );

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
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
      await EliminarUsuVol(id);
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

  const filteredData = searchTerm
    ? data.filter((UsuVol) => UsuVol.voluntariado_id.toString().includes(searchTerm))
    : data;

  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(offset, offset + itemsPerPage);

  return (
    <>
      <div className="type-registration">
        <h1 className="Namelist">Registro de Participantes</h1>
        <div>
          <input
            type="text"
            placeholder="Filtrar por el ID del voluntariado"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="Div-Table">
          <table className="Table custom-table">
            <thead>
              <tr>
                
                <th>ID Voluntariado</th>
                <th>Cedula Participante</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((UsuVol) => (
                <tr key={UsuVol.id}>
                  
                  <td>{UsuVol.voluntariado_id}</td>
                  <td>
                    {usuarios.length > 0 ? (
                      usuarios.find((user) => user.id === UsuVol.users_id) ? (
                        usuarios.find((user) => user.id === UsuVol.users_id).cedula
                      ) : (
                        "Cédula No Encontrada"
                      )
                    ) : "Loading..."}
                  </td>
                  <td>
                    <button onClick={() => handleDeleteConfirmation(UsuVol.id)} className="btnEliminar">
                      <span style={{ color: 'black' }}>
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

export default ParticipantesVol;
