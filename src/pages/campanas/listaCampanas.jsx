import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import TextField from "@mui/material/TextField";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DataGrid } from '@mui/x-data-grid';
import { getCampaña, eliminarCampana, actualizarEstadoCampana } from '../../services/CampanasServicios';
import { getTipos } from '../../services/TiposServicios';

const ListaCampanas = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useQuery('campana', getCampaña, { enabled: true });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [ setIsConfirmationOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 25;
  const queryClient = useQueryClient();
  const [editConfirm, setEditConfirm] = useState(null);
  const [isEditConfirmationOpen, setIsEditConfirmationOpen] = useState(false);
  const [tipos, setTipos] = useState([]);

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const tiposData = await getTipos();
        setTipos(tiposData);
      } catch (error) {
        console.error('Error al obtener la lista de tipos:', error);
      }
    };

    fetchTipos();
  }, []);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  /*const handleShowConfirmation = (id) => {
    setDeleteConfirm(id);
    setIsConfirmationOpen(true);
  };
*/
  const handleHideConfirmation = () => {
    setIsConfirmationOpen(false);
  };

  const handleShowEditConfirmation = (id) => {
    setEditConfirm(id);
    setIsEditConfirmationOpen(true);
  };

  const handleHideEditConfirmation = () => {
    setIsEditConfirmationOpen(false);
  };

const handleDeleteCampaña = async (id) => {
  try {
      await  eliminarCampana(id);
      await refetch();
      queryClient.invalidateQueries('deleteCampana');
      toast.success('¡Eliminado Exitosamente!', { position: toast.POSITION.TOP_RIGHT });
  } catch (error) {
      if (error.message === 'Error: Usuario está ligado a otra tabla') {
      toast.error('¡Usuario está ligado a otra tabla!', { position: toast.POSITION.TOP_RIGHT });
      } else {
          console.error(error);
      }
  }
  setDeleteConfirm(null);
};

const handleDeleteConfirmation = (id) => {
  setDeleteConfirm(id);
  setIsConfirmationOpen(true);
};


  const handleStatusChange = async (id, newStatus) => {
    try {
      await actualizarEstadoCampana(id, newStatus);
      await refetch();
      queryClient.invalidateQueries('campana');
      toast.success('¡Estado Actualizado Exitosamente!', { position: toast.POSITION.TOP_RIGHT });
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (isError) return <div className="error">Error</div>;

  const offset = currentPage * itemsPerPage;
  const filteredData = data.filter(camp => camp.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
  const currentData = filteredData.slice(offset, offset + itemsPerPage);

  // Definir las columnas para la tabla DataGrid
  const columns = [
    { field: 'id', headerName: 'ID Campaña', width: 150 },
    { field: 'nombre', headerName: 'Nombre', width: 150 },
    { field: 'descripcion', headerName: 'Descripción', width: 150 },
    { field: 'ubicacion', headerName: 'Ubicación', width: 150 },
    { field: 'fecha', headerName: 'Fecha', width: 150 },
    { field: 'alimentacion', headerName: 'Alimentación', width: 150 },
    { field: 'capacidad', headerName: 'Capacidad', width: 150 },
    { field: 'tipo', headerName: 'Tipo', width: 150, renderCell: params => (
        tipos.length > 0 ? 
          (tipos.find(tipo => tipo.id === params.value)?.nombreTipo || "NombreTipoNoEncontrado")
          : "Loading..."
      )
    },
    { field: 'inOex', headerName: 'Interna o Externa', width: 150 },
    { field: 'status', headerName: 'Estado', width: 150, renderCell: params => (
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
            <span style={{ color: 'black' }}>
              <FontAwesomeIcon icon="trash" />
            </span>
          </button>
          <button onClick={() => handleShowEditConfirmation(params.row.id)} className="btnModificarPrueba">
            <span style={{ color: 'black' }}>
              <FontAwesomeIcon icon="edit" />
            </span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="campaign-registration">
        <h1 className="Namelist">Registro de Campañas</h1>
        <Link to='/dashboard/crear-campana-admin'>
          <button className="btnRegistrarAdmin">Crear Campaña</button>
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



      {/* Modal de confirmación */}
      {deleteConfirm !== null && (
        <div className="overlay">
          <div className="delete-confirm">
            <p>¿Estás seguro de que deseas eliminar esta campaña?</p>
            <button onClick={handleDeleteCampaña} className="btn-confirm btn-yes">Sí</button>
            <button onClick={handleHideConfirmation} className="btn-confirm btn-no">No</button>
          </div>
        </div>
      )}


        {/* Modal de confirmación para editar */}
        {isEditConfirmationOpen && (
          <div className="overlay">
            <div className="edit-confirm">
              <p>¿Estás seguro de que deseas editar esta campaña?</p>
              <button onClick={() => {
                handleHideEditConfirmation();
                navigate(`/dashboard/campana-update/${editConfirm}`);
              }} className="btn-confirm btn-yes">Sí</button>
              <button onClick={handleHideEditConfirmation} className="btn-confirm btn-no">No</button>
            </div>
          </div>
        )}

      {/* Estilos en línea */}
      <style>
        
      </style>
    </>
  );
};

export default ListaCampanas;