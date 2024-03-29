import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DataGrid } from '@mui/x-data-grid'; // Importamos DataGrid
import {
  getReservaciones,
  eliminarReservacion,
  actualizarEstadoReservacion
} from "../../services/ReservacionesServicios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { FaFilePdf } from "react-icons/fa6";
import { generatePdfReport } from "../../pages/reservaciones/pdfReservaciones"; // Importar el método de generación de PDF
import TextField from "@mui/material/TextField";

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
  const [searchTerm, setSearchTerm] = useState('');

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleShowConfirmation = (id) => {
    setReservacionToDelete(id);
    setConfirmarVisible(true);
  };

  const handleEditReservaciones = (id) => {
    handleShowEditConfirmation(id);
  };

  const handleShowEditConfirmation = (id) => {
    setEditConfirm(id);
    setIsEditConfirmationOpen(true);
  };
  
  const handleHideEditConfirmation = () => {
    setIsEditConfirmationOpen(false);
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

  const handleStatusChange = async (id, newStatus) => {
    try {
      await actualizarEstadoReservacion(id, newStatus);
      await refetch();
      queryClient.invalidateQueries('reservacion');
      toast.success('¡Estado Actualizado Exitosamente!', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrintReport = () => {
    generatePdfReport(data);
};

  if (isLoading) return <div className="loading">Loading...</div>;

  if (isError) return <div className="error">Error</div>;

  const offset = currentPage * itemsPerPage;
  const filteredData = Array.isArray(data) ? data.filter(reservacion => reservacion.id.toString().toLowerCase().includes(searchTerm.toLowerCase())) : [];

  const currentData = filteredData.slice(offset, offset + itemsPerPage);

  const columns = [
    { field: 'id', headerName: 'ID Reservaciones', width: 150 },
    { field: 'nombreVis', headerName: 'Nombre Visitante', width: 200 },
    { field: 'apell1Vis', headerName: 'Primer Apellido', width: 200 },
    { field: 'apell2Vis', headerName: 'Segundo Apellido', width: 200 },
    { field: 'cedulaVis', headerName: 'Cédula Visitante', width: 180 },
    { field: 'fechaReserva', headerName: 'Fecha de Reserva', width: 200 },
    { field: 'cupo', headerName: 'Cupo', width: 120 },
    { field: 'telefonoVis', headerName: 'Teléfono Visitante', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    {
      field: 'status',
      headerName: 'Estado',
      width: 150,
      editable: true,
      renderCell: (params) => (
        <select
          value={params.value}
          onChange={(e) => handleStatusChange(params.id, e.target.value)}
        >
          <option value="Nueva">Nueva</option>
          <option value="En Proceso">En Proceso</option>
          <option value="Cancelada">Cancelada</option>
          <option value="Terminada">Terminada</option>
        </select>
      ),
    },
    { field: 'actions', headerName: 'Acciones', width: 150, renderCell: params => (
        <div>
        <button onClick={() => handleShowConfirmation(params.row.id)} className="btnEliminar">
          <span style={{ color: 'black' }}> {/* Esto cambiará el color del icono a rojo */}
            <FontAwesomeIcon icon="trash" />
          </span>
        </button>
        <button onClick={() =>  handleEditReservaciones(params.row.id)} className="btnModificar">
          <span style={{ color: 'black' }}> {/* Esto cambiará el color del icono a amarillo */}
            <FontAwesomeIcon icon="edit" />
          </span>
        </button>
        </div>
      )
    },
  ];

  return (
    <>
      <div className="user-reservations">
        <h1 className="Namelist">Reservaciones</h1>
        <Link to="/dashboard/crear-reservacion-admin">
          <button className="btnRegistrarAdmin">Crear Reservacion</button>
        </Link>
        <div className="filter-container">
        <TextField
            id="filled-search"
            label="Buscar por Nombre..."
            type="search"
            variant="filled"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />

        </div>
        <div className="Div-Table scrollable-table">
        <DataGrid
             rows={currentData}
             columns={columns}
             page={currentPage}
             pagination
             onPageChange={handlePageChange}
             checkboxSelection
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
          />
        </div>
        <div className="button-container">
                    <button onClick={handlePrintReport} className="btnPrint">
                        <FaFilePdf /> Imprimir Reporte
                    </button>
                </div>
        <ToastContainer />
      </div>

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
              navigate(`/dashboard/reservaciones-update/${editConfirm}`);
            }} className="btn-confirm btn-yes">Sí</button>
            <button onClick={handleHideEditConfirmation} className="btn-confirm btn-no">No</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ListaReservaciones;