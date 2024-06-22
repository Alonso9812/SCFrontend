import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSolicitudes, eliminarSolicitud, actualizarEstadoSolicitud } from "../../services/SolicitudServicio";
import { DataGrid } from '@mui/x-data-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { FaFilePdf } from "react-icons/fa6";
import { generatePdfReport } from"../../pages/solicitudes/pdfSolicitudes";

const ListaSolicitudes = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery(
    "mostrar-solicitudes",
    getSolicitudes,
    { enabled: true }
  );
  
  const [deleteConfirm, setDeleteConfirm] = useState(null);


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
  const handleStatusChange = async (id, newStatus) => {
    try {
      await actualizarEstadoSolicitud(id, newStatus);
      await refetch();
      queryClient.invalidateQueries('solicitud');
      toast.success('¡Estado Actualizado Exitosamente!', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error(error);
    }
  };
  const handleDeleteConfirmation = (id) => {
    setDeleteConfirm(id);
  };

	const handlePrintReport = () => {
    generatePdfReport(data); 
  };

  if (isLoading) return <div className="loading">Loading...</div>;

  if (isError) return <div className="error">Error</div>;

  const columns = [
    { field: 'id', headerName: 'ID Solicitud', width: 150 },
    { field: 'nomSoli', headerName: 'Nombre Solicitante', width: 200 },
    { field: 'apellSoli1', headerName: 'Primer Apellido', width: 200 },
    { field: 'apellSoli2', headerName: 'Segundo Apellido', width: 200 },
    { field: 'numSoli', headerName: 'Número', width: 150 },
    { field: 'email', headerName: 'Correo', width: 200 },
    { field: 'tituloVC', headerName: 'Titulo Solicitud', width: 200 },
    { field: 'descripVC', headerName: 'Descripción', width: 200 },
    { field: 'lugarVC', headerName: 'Lugar', width: 200 },
    { field: 'alimentacion', headerName: 'Alimentación', width: 200 },
    { field: 'tipoSoli', headerName: 'Tipo Solicitud', width: 200 },
    { field: 'fechaSoli', headerName: 'Fecha solicitada', width: 200 },
    {
      field: 'statusSoli',
      headerName: 'Estado',
      width: 150,
      editable: true,
      renderCell: (params) => (
        <select
          value={params.value}
          onChange={(e) => handleStatusChange(params.id, e.target.value)}
        >
          <option value="Nueva">Nueva</option>
          <option value="Aprobada">Aprobada</option>
          <option value="Rechazada">Rechazada</option>

          
        </select>
      ),
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 200,
      renderCell: (params) => (
        <div>
          <button onClick={() => handleDeleteConfirmation(params.row.id)} className="btnEliminarPrueba">
          <span style={{ color: 'white' }}>
            <FontAwesomeIcon icon="trash" />
          </span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="type-registration">
        <h1 className="Namelist">Registro de solicitudes</h1>
	<div className="button-container">
                    <button onClick={handlePrintReport} className="btnPrint">
                        <FaFilePdf /> Imprimir
                    </button>
                </div>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={data}
            columns={columns}
            rowsPerPageOptions={[]}
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