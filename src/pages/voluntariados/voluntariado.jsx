import { useRef, useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { create } from '../../services/VOluntariadosServicios';
import { toast, ToastContainer } from 'react-toastify';
import { getTipos } from '../../services/TiposServicios';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const VOluntariados = () => {
  const queryClient = useQueryClient();
  const nombreRef = useRef(null);
  const descripcionRef = useRef(null);
  const ubicacionRef = useRef(null);
  const fechaRef = useRef(null);
  const [alimentacion, setAlimentacion] = useState('sí');
  const capacidadRef = useRef(null);
  const tipoRef = useRef(null);
  const [inOex, setInOex] = useState('interno');
  const navigate = useNavigate(); // Obtén la función navigate

  const mutation = useMutation("create-voluntariado", create, {
    onSettled: () => queryClient.invalidateQueries("create-voluntariado"),
    mutationKey: "create-voluntariado",
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

  const tiposActivos = Tipos.filter((tipo) => tipo.statusVC === 'Activo');

  const handleRegistro = async (e) => {
    e.preventDefault();

    let newVOluntariado = {
      nombre: nombreRef.current.value,
      descripcion: descripcionRef.current.value,
      ubicacion: ubicacionRef.current.value,
      fecha: fechaRef.current.value,
      alimentacion,
      capacidad: capacidadRef.current.value,
      tipo: tipoRef.current.value,
      inOex,
    };

    await mutation.mutateAsync(newVOluntariado);

    toast.success('¡Guardado Exitosamente!', {
      position: toast.POSITION.TOP_RIGHT
    });
  };

  return (
    <div className="registro">
      <h2>Nuevo Voluntariado</h2>
      <form onSubmit={handleRegistro}>
        <div>
          <label htmlFor="nombre">Nombre del voluntariado:</label>
          <input
            type="text"
            id="nombre"
            ref={nombreRef}
            required
          />
        </div>
        <div>
          <label htmlFor="descripcion">Descripción del  voluntariado:</label>
          <input
            type="text"
            id="descripcion"
            ref={descripcionRef}
            required
          />
        </div>
        <div>
          <label htmlFor="ubicacion">Ubicación del  voluntariado:</label>
          <input
            type="text"
            id="ubicacion"
            ref={ubicacionRef}
            required
          />
        </div>
        <div>
          <label htmlFor="fecha">Fecha del voluntariado:</label>
          <input
            type="date"
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
            <option value="Interno">Interno</option>
            <option value="Externo">Externo</option>
          </select>
        </div>
        <div  className="centerr-button">
          <button className='btnAddVoluntariado' type="submit">Crear</button>
        </div>
      </form>
      <div className="center-buttonEv">
        <button onClick={() => navigate('/listaVoluntariados')}>Volver</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default VOluntariados;
