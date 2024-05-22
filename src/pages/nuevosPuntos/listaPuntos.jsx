import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getPuntosDIS, eliminarPunto, actualizarEstadoPunto } from '../../services/NuevosPuntos';
import { useNavigate, Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { toast, ToastContainer } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TextField from "@mui/material/TextField";

const ListaPuntos = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery('Puntos', getPuntosDIS, { enabled: true });
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [editConfirm, setEditConfirm] = useState(null);
  const [isEditConfirmationOpen, setIsEditConfirmationOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const itemsPerPage = 25;
  const [currentPage, setCurrentPage] = useState(0);

  const { mutate: eliminarPuntoMutation } = useMutation(eliminarPunto, {
    onSuccess: () => {
      queryClient.invalidateQueries('Puntos');
    },
  });

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

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
      await actualizarEstadoPunto(id, newStatus);
      await refetch();
      queryClient.invalidateQueries('Puntos');
      toast.success('¡Estado Actualizado Exitosamente!', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (isError) return <div className="error">Error</div>;

  // Filtrar las filas basadas en el término de búsqueda
  const filterRows = (rows) => {
    return rows.filter(rows =>
      rows.nombrePunto.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredRows = filterRows(data);

  const columns = [
    { field: 'id', headerName: 'ID Punto', width: 150 },
    { field: 'nombrePunto', headerName: 'Nombre Punto', width: 200 },
    { field: 'descripcionPunto', headerName: 'Descripción', width: 300 },
    { field: 'ubicacionPunto', headerName: 'Ubicación', width: 200 },
    {
      field: 'galeria',
      headerName: 'Imagen',
      width: 200,
      renderCell: (params) => (
        <img
          src={`https://senderocornizuelo.xyz/api/storage/galeria/${params.value}`}
          alt={params.value}
          className='img-responsive'
        />
      ),
    },
    {
      field: 'statusPunto',
      headerName: 'Estado',
      width: 150,
      renderCell: (params) => (
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
      ),
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 200,
      renderCell: (params) => (
        <div>
          <button onClick={() => handleShowConfirmation(params.row.id)} className="btnEliminarPrueba">
            <FontAwesomeIcon icon="trash" />
          </button>
          <button onClick={() => handleEditPunto(params.row.id)} className="btnModificarPrueba">
            <FontAwesomeIcon icon="edit" />
          </button>
        </div>
      ),
    },
  ];
const offset = currentPage * itemsPerPage;
const filteredData = Array.isArray(data) ? data.filter(row => row.nombrePunto.toLowerCase().includes(searchTerm.toLowerCase())) : [];
const currentData = filteredData.slice(offset, offset + itemsPerPage);

  return (
    <>
      <div className="type-registration">
        <h1 className="Namelist">Lista Puntos De Interés Sostenible</h1>
        <Link to='/dashboard/nuevo-punto-admin'>
          <button className='btnRegistrarAdmin'>Crear Punto</button>
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

      {isConfirmationOpen && (
        <div className="overlay">
          <div className="delete-confirm">
            <p>¿Estás seguro de que deseas eliminar este punto de interés?</p>
            <button onClick={handleDeletePunto} className="btn-confirm btn-yes">Sí</button>
            <button onClick={handleHideConfirmation} className="btn-confirm btn-no">No</button>
          </div>
        </div>
      )}

      {isEditConfirmationOpen && (
        <div className="overlay">
          <div className="edit-confirm">
            <p>¿Estás seguro de que deseas editar este punto de interés?</p>
            <button onClick={() => {
              handleHideEditConfirmation();
              navigate(`/dashboard/update-punto/${editConfirm}`);
            }} className="btn-confirm btn-yes">Sí</button>
            <button onClick={handleHideEditConfirmation} className="btn-confirm btn-no">No</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ListaPuntos;