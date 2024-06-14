import  { useState } from "react";
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { eliminarTipo, actualizarEstadoTipo, getTipos } from "../../services/TiposServicios";
import { DataGrid } from '@mui/x-data-grid';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TextField from "@mui/material/TextField";

const ListaTipos = () => {
  const { data, isLoading, isError, refetch } = useQuery(
    "ver-tipo",
    getTipos,
    { enabled: true }
  );
  const navigate = useNavigate();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();
  const [editConfirm, setEditConfirm] = useState(null);
  const [isEditConfirmationOpen, setIsEditConfirmationOpen] = useState(false);

  const handlePageChange = (event, value) => {
    setCurrentPage(value - 1);
  };

  const handleDeleteTipo = async (id) => {
    try {
      await eliminarTipo(id);
      await refetch();
      toast.success("¡Eliminado Exitosamente!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error('Error capturado:', error);
  
      const errorMessage = error.message || error.toString();
      if (errorMessage.includes('Usuario está ligado a otra tabla')) {
        toast.error('¡Categoria ligada a otra tabla!', {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.error('¡Ocurrió un error inesperado!', {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteConfirm(id);
  };

  const handleShowEditConfirmation = (id) => {
    setEditConfirm(id);
    setIsEditConfirmationOpen(true);
  };

  const handleHideEditConfirmation = () => {
    setIsEditConfirmationOpen(false);
  };

  const handleEditTipo = (id) => {
    handleShowEditConfirmation(id);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Llamada a la función que actualiza el estado del usuario
      await actualizarEstadoTipo(id, newStatus);
      // Recargar la lista de usuarios después de la actualización
      await refetch();
      queryClient.invalidateQueries('tipos');
      toast.success('¡Estado Actualizado Exitosamente!', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <div className="loading">Loading...</div>;

  if (isError) return <div className="error">Error</div>;

  const offset = currentPage ;
  const pageCount = Math.ceil(data.length);
  const filteredData = data.filter(tipo =>
    tipo.nombreTipo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const currentData = filteredData.slice(offset);

  // Definir las columnas para la tabla DataGrid
  const columns = [
    { field: 'id', headerName: 'ID Tipo', width: 150 },
    { field: 'nombreTipo', headerName: 'Nombre', width: 200 },
    { field: 'statusVC', headerName: 'Estado', width: 150, renderCell: params => (
        <select
          value={params.value}
          onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
          style={{
            backgroundColor: params.value === 'Activo' ? 'green' : 'lightgray',
            color: params.value === 'Activo' ? 'white' : 'black',
            borderRadius: '5px'
          }}
        >
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      )
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 150,
      renderCell: params => (
        <div>
          <button onClick={() => handleDeleteConfirmation(params.row.id)} className="btnEliminarPrueba">
            <span style={{ color: 'white' }}>
              <FontAwesomeIcon icon="trash" />
            </span>
          </button>
          <button onClick={() =>  handleEditTipo(params.row.id)} className="btnModificarPrueba">
            <span style={{ color: 'white' }}>
              <FontAwesomeIcon icon="edit" />
            </span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="type-registration">
        <h1 className="Namelist">Registro de tipos para campañas y voluntariados</h1>
        <Link to="/dashboard/agregar-tipo-admin">
          <button className="btnRegistrarAdmin">Crear Categoría</button>
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
        <div style={{ height: 400, width: '100%' }}>
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
        <ToastContainer />
      </div>

      {deleteConfirm !== null && (
        <div className="overlay">
          <div className="delete-confirm">
            <p>¿Estás seguro de que quieres eliminar este tipo?</p>
            <button onClick={() => handleDeleteTipo(deleteConfirm)}>Sí</button>
            <button onClick={() => setDeleteConfirm(null)}>No</button>
          </div>
        </div>
      )}

      {isEditConfirmationOpen && (
      <div className="overlay">
        <div className="edit-confirm">
          <p>¿Estás seguro de que deseas editar este tipo?</p>
          <button onClick={() => {
            handleHideEditConfirmation();
            navigate(`/dashboard/update-tipo/${editConfirm}`);
          }} className="btn-confirm btn-yes">Sí</button>
          <button onClick={handleHideEditConfirmation} className="btn-confirm btn-no">No</button>
        </div>
      </div>
    )}

    <div className="pagination-container">
      <Stack spacing={2}>
        <Pagination count={pageCount} page={currentPage + 1} onChange={handlePageChange} />
      </Stack>
    </div>
    </>
  );
};

export default ListaTipos;