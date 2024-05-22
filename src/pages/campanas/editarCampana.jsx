import { useParams, useNavigate } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react'; 
import { useMutation, useQueryClient } from 'react-query';
import { updateCampaña, getCampañaID } from '../../services/CampanasServicios'; 
import { toast, ToastContainer } from 'react-toastify';
import { getTipos } from '../../services/TiposServicios';

const EditarCampaña = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); // Obtén la función navigate

  const queryClient = useQueryClient();
  const Campananombre = useRef(null);
  const Campanadescripcion = useRef(null);
  const Campanaubicacion = useRef(null);
  const Campanafecha = useRef(null);
  const [alimentacion, setAlimentacion] = useState('sí'); 
  const Campanacapacidad = useRef(null);
  const Campanatipo = useRef(null);
  const [inOex, setInOex] = useState('interno');
  
  const mutationKey = `campaña-update/${id}`;
  const mutation = useMutation(mutationKey, updateCampaña, {
    onSettled: () => queryClient.invalidateQueries(mutationKey),
  });

  const [Tipos, setTipo] = useState([]);

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const TiposData = await getTipos();
        setTipo(TiposData);
      } catch (error) {
        console.error('Error al obtener la lista de tipos:', error);
      }
    };

    fetchTipos();
  }, []);

  const handleRegistro = (event) => {
    event.preventDefault();
    
    let newData = {
      id: id,
      nombre: Campananombre.current.value,
      descripcion: Campanadescripcion.current.value,
      ubicacion: Campanaubicacion.current.value,
      fecha: Campanafecha.current.value,
      alimentacion,
      capacidad: Campanacapacidad.current.value,
      tipo: Campanatipo.current.value,
      inOex,
    };

    mutation.mutateAsync(newData)
      .catch((error) => {
        console.error('Error en la solicitud Axios:', error);
      });

    toast.success('¡Guardada Exitosamente!', {
      position: toast.POSITION.TOP_RIGHT,
    });

    setTimeout(() => {
      navigate("/dashboard/listaCampanas");
    }, 2000);
    
  };

  useEffect(() => {
    async function cargarDatosCampaña() {
      try {
        const datosCampaña = await getCampañaID(id); 
        Campananombre.current.value = datosCampaña.nombre;
        Campanadescripcion.current.value = datosCampaña.descripcion;
        Campanaubicacion.current.value = datosCampaña.ubicacion;
        Campanafecha.current.value = datosCampaña.fecha;
        setAlimentacion(datosCampaña.alimentacion);
        Campanacapacidad.current.value = datosCampaña.capacidad;
        Campanatipo.current.value = datosCampaña.tipo;
        setInOex(datosCampaña.inOex);
      } catch (error) {
        console.error(error);
      }
    }

    cargarDatosCampaña();
  }, [id]);

  return (
    <div className='edit-camp'>
      <h1>Editar Campaña</h1>
      <p>ID de la Campaña a editar: {id}</p>
      <form onSubmit={handleRegistro}>
        <div>
          <label htmlFor="nombre" className='nombrecamp'>Nombre:</label>
          <input
            type="text"
            id="nombre"
            ref={Campananombre}
            required
          />
        </div>
        <div>
          <label htmlFor="descripcion"className='Desccamp'>Descripcion:</label>
          <input
            type="text"
            id="descripcion"
            ref={Campanadescripcion}
            required
          />
        </div>
        <div>
          <label htmlFor="ubicacion" className='Ubicamp'>Ubicacion:</label>
          <input
            type="text"
            id="ubicacion"
            ref={Campanaubicacion}
            required
          />
        </div>
        <div>
          <label htmlFor="fecha" className='Feccamp'>Fecha:</label>
          <input
            type="datetime-local"
            id="fecha"
            ref={Campanafecha}
            required
          />
        </div>
        <div>
          <label htmlFor="alimentacion" className="label">¿Se dará alimentación?</label>
          <select
            id="alimentacion"
            className="select" // Agrega una clase para el combobox
            onChange={(e) => setAlimentacion(e.target.value)}
            value={alimentacion}
            required
          >
            <option value="Sí">Sí</option>
            <option value="No">No</option>
          </select>
        </div>
        <div>
          <label htmlFor="cupo" className='capcamp'>Capacidad:</label>
          <input
            type="text"
            id="cupo"
            ref={Campanacapacidad}
            required
          />
        </div>
        <div>
          <label htmlFor="Tipo" style={{ color: 'black' }}>Tipo :</label>
          <select id="id" ref={Campanatipo} className="select" required>
            {Tipos.map((tipos) => (
              <option key={tipos.id} value={tipos.id}>
                {tipos.nombreTipo}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="inOex" className="label">¿Será para internos o externos?</label>
          <select
            id="inOex"
            className="select" // Agrega una clase para el combobox
            onChange={(e) => setInOex(e.target.value)}
            value={inOex}
            required
          >
            <option value="Interno">Interno</option>
            <option value="Externo">Externo</option>
          </select>
        </div>
        <div className="center-buttonCamp">
        <button type="button" onClick={() => navigate('/dashboard/listaCampanas')}>Volver</button>
        </div>
        <div className="camp-button-volver">
        <button type="submit">Modificar</button>
      </div>
      </form>
      
      <ToastContainer />
    </div>
  );
};

export default EditarCampaña;
