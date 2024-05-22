import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { getUsuarios, ELiminarUsuario, actualizarEstadoUsuario, actualizarRolUsuario  } from '../../services/UsuariosServicios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextField from "@mui/material/TextField";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DataGrid } from '@mui/x-data-grid'; // Importar DataGrid y DataGridColumns de Material-UI



const ListUsuarios = () => {
  const { data = [], isLoading, isError, refetch } = useQuery('showU', getUsuarios, { enabled: true });
  const navigate = useNavigate();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 25;
  const queryClient = useQueryClient();
  const [editConfirm, setEditConfirm] = useState(null);
  const [isEditConfirmationOpen, setIsEditConfirmationOpen] = useState(false);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleDeleteUsuario = async (id) => {
    try {
        await ELiminarUsuario(id);
        await refetch();
        queryClient.invalidateQueries('deleteUSer');
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
  };

  const handleShowEditConfirmation = (id) => {
    setEditConfirm(id);
    setIsEditConfirmationOpen(true);
  };
  
  const handleHideEditConfirmation = () => {
    setIsEditConfirmationOpen(false);
  };
  
  const handleEditUsuario = (id) => {
    handleShowEditConfirmation(id);
  };

  const handleRolChange = async (id, newStatus) => {
    try {
      await actualizarRolUsuario(id, newStatus);
      await refetch();
      queryClient.invalidateQueries('showU');
      toast.success('¡Estado Actualizado Exitosamente!', { position: toast.POSITION.TOP_RIGHT });
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await actualizarEstadoUsuario(id, newStatus);
      await refetch();
      queryClient.invalidateQueries('showU');
      toast.success('¡Estado Actualizado Exitosamente!', { position: toast.POSITION.TOP_RIGHT });
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (isError) return <div className="error">Error</div>;

  const offset = currentPage * itemsPerPage;
  const filteredData = Array.isArray(data) ? data.filter(user => user.cedula.toLowerCase().includes(searchTerm.toLowerCase())) : [];
  const currentData = filteredData.slice(offset, offset + itemsPerPage);
  
  // Definir las columnas para la tabla DataGrid
  const columns = [
    { field: 'id', headerName: 'ID Usuario', width: 150 },
    { field: 'name', headerName: 'Nombre', width: 150 },
    { field: 'apell1', headerName: 'Primer Apellido', width: 150 },
    { field: 'apell2', headerName: 'Segundo Apellido', width: 150 },
    { field: 'cedula', headerName: 'Cédula', width: 150 },
    { field: 'numero', headerName: 'Número', width: 150 },
    { field: 'ocupacion', headerName: 'Ocupación', width: 150 },
    { field: 'rol', headerName: 'Rol', width: 150, editable: true, renderCell: params => (
        <select
          value={params.value}
          onChange={(e) => handleRolChange(params.id, e.target.value)}
          style={{
            borderRadius: '5px'
          }}
        >
          <option value="admin">Admin</option>
          <option value="voluntario">Voluntario</option>
        </select>
      )
    },
    { field: 'email', headerName: 'Correo', width: 150 },
    { field: 'status', headerName: 'Estado', width: 150, editable: true, renderCell: params => (
        <select
          value={params.value}
          onChange={(e) => handleStatusChange(params.id, e.target.value)}
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
      renderCell: (params) => (
        <div>
          <button onClick={() => handleDeleteConfirmation(params.row.id)} className="btnEliminarPrueba">
            <span style={{ color: 'black', alignItems: 'center', height: '50px', width: '50px'  }}>
              <FontAwesomeIcon icon="trash" />
            </span>
          </button>
          <button onClick={() => handleEditUsuario(params.row.id)} className="btnModificarPrueba">
            <span style={{ color: 'black', textAlign: 'center', height: '50px', width: '50px' }}>
              <FontAwesomeIcon icon="edit" />
            </span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
    
      <div className="user-registration">
        <h4 className="Namelist">Registro de Usuarios</h4>
        <Link to="/dashboard/agregar-usuario-admin" className="btnRegistrarAdmin">Crear Usuario</Link>

        <div className="filter-container">
          <TextField
            id="filled-search"
            label="Buscar por Cedula..."
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
            <p>¿Estás seguro de que quieres eliminar este usuario?</p>
            <button onClick={() => handleDeleteUsuario(deleteConfirm)}>Sí</button>
            <button onClick={() => setDeleteConfirm(null)}>No</button>
          </div>
        </div>
      )}

      {isEditConfirmationOpen && (
        <div className="overlay">
          <div className="edit-confirm">
            <p>¿Estás seguro de que deseas editar este usuario?</p>
            <button onClick={() => {
              handleHideEditConfirmation();
              navigate(`/dashboard/user-update/${editConfirm}`);
            }} className="btn-confirm btn-yes">Sí</button>
            <button onClick={handleHideEditConfirmation} className="btn-confirm btn-no">No</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ListUsuarios;