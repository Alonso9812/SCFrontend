import  { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUsuVol, EliminarUsuVol } from "../../services/ParticipantesServicios";
import { getUsuarios } from '../../services/UsuariosServicios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DataGrid } from '@mui/x-data-grid';
import TextField from "@mui/material/TextField";

import { generatePdfReport } from "../../pages/voluntariados/pdfVoluntariados";
import { FaFilePdf } from "react-icons/fa6";

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
  const [users, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const usuariosData = await getUsuarios();
        setUsuarios(usuariosData);
      } catch (error) {
        console.error('Error al obtener la lista de usuarios:', error);
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
      toast.error("Error al eliminar el participante", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    setDeleteConfirm(null);
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteConfirm(id);
  };

  const handlePrintReport = () => {
    generatePdfReport(data, searchTerm, users); 
  };

  if (isLoading) return <div className="loading">Loading...</div>;

  if (isError) return <div className="error">Error</div>;

  const filteredData = searchTerm
    ? data.filter((usuVol) => usuVol.voluntariado_id.toString().includes(searchTerm))
    : data;

  const offset = currentPage * itemsPerPage;
  const currentData = filteredData.slice(offset, offset + itemsPerPage);

  const columns = [
    { field: 'voluntariado_id', headerName: 'ID Voluntariado', flex: 1 },
    { field: 'cedula', headerName: 'Cedula', width: 150, renderCell: params => {
      const usuario = users.find(user => user.id === params.row.users_id);
      return usuario ? usuario.cedula : "CedulaNoEncontrada";
    }},
    { field: 'nombre', headerName: 'Nombre', width: 150, renderCell: params => {
      const usuario = users.find(user => user.id === params.row.users_id);
      return usuario ? usuario.name : "CedulaNoEncontrada";
    }},
    { field: 'apellido', headerName: 'Apellido', width: 150, renderCell: params => {
      const usuario = users.find(user => user.id === params.row.users_id);
      return usuario ? usuario.apell1 : "CedulaNoEncontrada";
    }},
    {
      field: 'acciones',
      headerName: 'Acciones',
      flex: 1,
      renderCell: (params) => (
        <button onClick={() => handleDeleteConfirmation(params.row.id)} className="btnEliminarPrueba">
          <span style={{ color: 'black' }}>
            <FontAwesomeIcon icon="trash" />
          </span>
        </button>
      )
    }
  ];
  
  return (
    <>
      <div className="type-registration">
        <h1 className="Namelist">Registro de Participantes</h1>
        <div className="filter-container">
          <TextField
            id="filled-search"
            label="Buscar por ID voluntariado..."
            type="search"
            variant="filled"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="button-container">
          <button onClick={handlePrintReport} className="btnPrint">
            <FaFilePdf /> Imprimir Reporte
          </button>
        </div>
        <div style={{ height: 400, width: '100%' }}>
          {users.length > 0 && (
            <DataGrid
            rows={currentData}
            columns={columns}
            page={currentPage}
            pagination
            onPageChange={handlePageChange}
            checkboxSelection
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 20 },
              },
            }}
            pageSizeOptions={[20, 25]}
            />
          )}
        </div>
        <ToastContainer />
      </div>

      {deleteConfirm !== null && (
        <div className="overlay">
          <div className="delete-confirm">
            <p>¿Estás seguro de que quieres eliminar este participante?</p>
            <button onClick={() => handleDeleteCandidate(deleteConfirm)}>Sí</button>
            <button onClick={() => setDeleteConfirm(null)}>No</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ParticipantesVol;