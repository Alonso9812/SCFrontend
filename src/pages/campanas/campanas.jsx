import { useRef, useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { create } from '../../services/CampanasServicios';
import { toast, ToastContainer } from 'react-toastify';
import { getTipos } from '../../services/TiposServicios';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const Campanas = () => {
  const queryClient = useQueryClient();
  const nombreRef = useRef(null);
  const descripcionRef = useRef(null);
  const ubicacionRef = useRef(null);
  const fechaRef = useRef(null);
  const [alimentacion, setAlimentacion] = useState('sí');
  const capacidadRef = useRef(null);
  const tipoRef = useRef(null);
  const [inOex, setInOex] = useState('interno'); // Estado para rastrear la selección
  const navigate = useNavigate(); // Obtén la función navigate


  const mutation = useMutation("create-campana", create, {
    onSettled: () => queryClient.invalidateQueries("create-campana"),
    mutationKey: "create-campana",
    onError: (error) => {
      toast.error('Error al guardar: ' + error.message, {
        position: toast.POSITION.TOP_RIGHT
      });
    }
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

  // Filtrar tipos activos
  const tiposActivos = Tipos.filter((tipo) => tipo.statusVC === 'Activo');

  const handleRegistro = async (e) => {
    e.preventDefault();

    let newCampana = {
      nombre: nombreRef.current.value,
      descripcion: descripcionRef.current.value,
      ubicacion: ubicacionRef.current.value,
      fecha: fechaRef.current.value,
      alimentacion,
      capacidad: capacidadRef.current.value,
      tipo: tipoRef.current.value,
      inOex,
    };

    await mutation.mutateAsync(newCampana);

    toast.success('¡Guardado Exitosamente!', {
      position: toast.POSITION.TOP_RIGHT
    });
    setTimeout(() => {
      navigate("/dashboard/listaCampanas");
    }, 2000);
  };

  return (
    <div className="campanas">
      <h2>Nueva Campaña</h2>
      <form onSubmit={handleRegistro}>
        <div>
          <label htmlFor="nombre">Nombre de la campaña:</label>
          <input
            type="text"
            id="nombre"
            ref={nombreRef}
            required
          />
        </div>
        <div>
          <label htmlFor="descripcion">Descripción de la campaña:</label>
          <input
            type="text"
            id="descripcion"
            ref={descripcionRef}
            required
          />
        </div>
        <div>
          <label htmlFor="ubicacion">Ubicación de la campaña:</label>
          <input
            type="text"
            id="ubicacion"
            ref={ubicacionRef}
            required
          />
        </div>
        <div>
          <label htmlFor="fecha">Fecha de la campaña:</label>
          <input
            type="datetime-local"
            id="fecha"
            ref={fechaRef}
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
            <option value=" "> </option>
            <option value="Sí">Sí</option>
            <option value="No">No</option>
          </select>
        </div>
        <div>
          <label htmlFor="cupo">Capacidad:</label>
          <input
            type="text"
            id="cupo"
            ref={capacidadRef}
            required
          />
        </div>
        <div>
          <label htmlFor="Tipo" style={{ color: 'black' }}>Tipo :</label>
          <select id="id" ref={tipoRef} className="select" required>
            {tiposActivos.map((tipos) => (
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
            <option value=""> </option>
            <option value="Interno">Interno</option>
            <option value="Externo">Externo</option>
          </select>
        </div>
        <div className="center-buttonn">
        <button type="button" onClick={() => navigate('/dashboard/listaCampanas')}>Volver</button>
        </div>
        <div className="center-button-volver">
        <button type="submit">Crear</button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Campanas;