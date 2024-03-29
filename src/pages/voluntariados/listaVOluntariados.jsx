import  { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { getVOluntariado, eliminarVOluntariado, actualizarEstadoVoluntariado } from '../../services/VOluntariadosServicios';
import { getTipos } from '../../services/TiposServicios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DataGrid } from '@mui/x-data-grid';
import TextField from "@mui/material/TextField";

const ListaVoluntariados = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useQuery('mostrar-voluntariado', getVOluntariado, { enabled: true });
  const [editConfirm, setEditConfirm] = useState(null);
  const [isEditConfirmationOpen, setIsEditConfirmationOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 25;
  const queryClient = useQueryClient();
  const [tipos, setTipos] = useState([]);

  const { mutate: eliminarVOluntariadoMutation } = useMutation(eliminarVOluntariado, {
    onSuccess: () => {
      queryClient.invalidateQueries('Voluntariado');
    },
  });

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

  const handleShowConfirmation = (id) => {
    setDeleteConfirm(id);
    setIsConfirmationOpen(true);
  };

  const handleHideConfirmation = () => {
    setIsConfirmationOpen(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await actualizarEstadoVoluntariado(id, newStatus);
      await refetch();
      queryClient.invalidateQueries('campana');
      toast.success('¡Estado Actualizado Exitosamente!', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteVOluntariado = async () => {
    try {
      await eliminarVOluntariadoMutation(deleteConfirm);
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

  const handlePageChange = (params) => {
    setCurrentPage(params.page);
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (isError) return <div className="error">Error</div>;

  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(data.length / itemsPerPage);
  const filteredData = data.filter(camp =>
    camp.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const currentData = filteredData.slice(offset, offset + itemsPerPage);

  const columns = [
    { field: 'id', headerName: 'ID Voluntariado', width: 150 },
    { field: 'nombre', headerName: 'Nombre', width: 200 },
    { field: 'descripcion', headerName: 'Descripción', width: 200 },
    { field: 'ubicacion', headerName: 'Ubicación', width: 200 },
    { field: 'fecha', headerName: 'Fecha', width: 150 },
    { field: 'alimentacion', headerName: 'Alimentación', width: 150 },
    { field: 'capacidad', headerName: 'Capacidad', width: 150 },
    { field: 'tipo', headerName: 'Tipo', width: 150, renderCell: params => (
      tipos.length > 0 ? 
        (tipos.find(tipo => tipo.id === params.value)?.nombreTipo || "NombreTipoNoEncontrado")
        : "Loading..."
    )
  },
    { field: 'inOex', headerName: 'Interna o Externa', width: 200 },
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
    { field: 'actions', headerName: 'Acciones', width: 150, renderCell: params => (
        <div>
          <button onClick={() => handleShowConfirmation(params.row.id)} className="btnEliminar">
            <FontAwesomeIcon icon="trash" />
          </button>
          <button onClick={() => handleShowEditConfirmation(params.row.id)} className="btnModificar">
            <FontAwesomeIcon icon="edit" />
          </button>
        </div>
      )
    },
  ];

  return (
    <>
      <div className="campaign-registration">
        <h1 className="Namelist">Registro de Voluntariados</h1>
        <Link to="/dashboard/nuevo-voluntariados-admin"><button className="btnRegistrarAdmin">Crear Voluntariado</button></Link>
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
      {/* Paginación */}
      {/* Modal de confirmación */}
      {isConfirmationOpen && (
        <div className="overlay">
          <div className="delete-confirm">
            <p>¿Estás seguro de que deseas eliminar este voluntariado?</p>
            <button onClick={handleDeleteVOluntariado} className="btn-confirm btn-yes">Sí</button>
            <button onClick={handleHideConfirmation} className="btn-confirm btn-no">No</button>
          </div>
        </div>
      )}

    {isEditConfirmationOpen && (
        <div className="overlay">
          <div className="edit-confirm">
            <p>¿Estás seguro de que deseas editar este voluntariado?</p>
            <button onClick={() => {
              handleHideEditConfirmation();
              navigate(`/dashboard/voluntariado-update/${editConfirm}`);
            }} className="btn-confirm btn-yes">Sí</button>
            <button onClick={handleHideEditConfirmation} className="btn-confirm btn-no">No</button>
          </div>
        </div>
    )}
      
    </>
  );
};

export default ListaVoluntariados;