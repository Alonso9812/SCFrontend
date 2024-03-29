import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSolicitudes, eliminarSolicitud } from "../../services/SolicitudServicio";
import { DataGrid } from '@mui/x-data-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { FaFilePdf } from "react-icons/fa6";
import { generatePdfReport } from"../../pages/solicitudes/pdfSolicitudes";

const ListaSolicitudes = () => {
  const { data, isLoading, isError, refetch } = useQuery(
    "mostrar-solicitudes",
    getSolicitudes,
    { enabled: true }
  );
  const navigate = useNavigate();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const itemsPerPage = 10;

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

  const handlePrintReport = () => {
    generatePdfReport(data); // Llamar al método de generación de PDF
};

  if (isLoading) return <div className="loading">Loading...</div>;

  if (isError) return <div className="error">Error</div>;

  const columns = [
    { field: 'id', headerName: 'ID Solicitud', width: 150 },
    { field: 'nomSoli', headerName: 'Nombre Solicitante', width: 200 },
    { field: 'apellSoli1', headerName: 'Primer Apellido', width: 200 },
    { field: 'apellSoli2', headerName: 'Segundo Apellido', width: 200 },
    { field: 'numSoli', headerName: 'Numero', width: 150 },
    { field: 'email', headerName: 'Correo', width: 200 },
    { field: 'tituloVC', headerName: 'Titulo Solicitud', width: 200 },
    { field: 'descripVC', headerName: 'Descripción', width: 200 },
    { field: 'lugarVC', headerName: 'Lugar', width: 200 },
    { field: 'alimentacion', headerName: 'Alimentación', width: 200 },
    { field: 'tipoSoli', headerName: 'Tipo Solicitud', width: 200 },
    { field: 'fechaSoli', headerName: 'Fecha solicitada', width: 200 },
    { field: 'statusSoli', headerName: 'Estado', width: 150 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 200,
      renderCell: (params) => (
        <div>
          <button onClick={() => handleDeleteConfirmation(params.row.id)} className="btnEliminar">
            <FontAwesomeIcon icon="trash" />
          </button>
          <button onClick={() =>  handleEditTipo(params.row.id)} className="btnModificar">
            <FontAwesomeIcon icon="edit" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="type-registration">
        <h1 className="Namelist">Registro de solicitudes</h1>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={data}
            columns={columns}
            rowsPerPageOptions={[itemsPerPage]}
            checkboxSelection
            pagination
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
          />

        </div>
        <ToastContainer />
      </div>
      <div className="button-container">
          <button onClick={handlePrintReport} className="btn-pdf">
            <FaFilePdf /> Imprimir Reporte
          </button>
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
    </>
  );
};

export default ListaSolicitudes;