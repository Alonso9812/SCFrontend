import { useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importa useNavigate
import { useMutation, useQueryClient } from 'react-query';
import { updatePunto, getPuntoID } from '../../services/NuevosPuntos'; 
import { toast, ToastContainer } from 'react-toastify';

const EditarPunto = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // Declara navigate

  const NombrePunto = useRef(null);
  const DescripcionPunto = useRef(null);
  const UbicacionPunto = useRef(null);
  const Galeria = useRef(null);

  const mutationKey = `update-punto/${id}`;
  const mutation = useMutation(mutationKey, updatePunto, {
    onSettled: () => queryClient.invalidateQueries(mutationKey),
  });

  const handleRegistro = async (event) => {
    event.preventDefault();

    // Verificar si se ha adjuntado un archivo de imagen
    if (!Galeria.current.files[0]) {
      toast.error('Por favor, adjunta una imagen.', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    let newData = {
      id: id,
      nombrePunto: NombrePunto.current.value,
      descripcionPunto: DescripcionPunto.current.value,
      ubicacionPunto: UbicacionPunto.current.value,
      galeria: Galeria.current.files[0],
    };

    try {
      // Enviar la solicitud de actualización al servidor
      await mutation.mutateAsync(newData);
      toast.success('¡Guardado Exitosamente!', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error('Error en la solicitud Axios:', error);
      toast.error('Error al actualizar el punto.', {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  useEffect(() => {
    async function cargarDatosTipo() {
      try {
        const datosPunto = await getPuntoID(id);
        NombrePunto.current.value = datosPunto.nombrePunto;
        DescripcionPunto.current.value = datosPunto.descripcionPunto;
        UbicacionPunto.current.value = datosPunto.ubicacionPunto;
      } catch (error) {
        console.error(error);
      }
    }

    cargarDatosTipo();
  }, [id]);

  return (
    <div className="edit-container-punto">
      <h1 className="edit-punto">Editar Punto</h1>
      <p className="edit-id">ID del Punto a editar: {id}</p>
      <form onSubmit={handleRegistro} className="edit-form">
        <div className="edit-input">
          <label htmlFor="nombrePunto" className="edit-label">
            Nombre:
          </label>
          <input
            type="text"
            id="nombrePunto"
            ref={NombrePunto}
            required
            className="edit-input-field"
          />
        </div>
        <div className="edit-input">
          <label htmlFor="descripcionPunto" className="edit-label">
            Descripción:
          </label>
          <input
            type="text"
            id="descripcionPunto"
            ref={DescripcionPunto}
            required
            className="edit-input-field"
          />
        </div>
        <div className="edit-input">
          <label htmlFor="ubicacionPunto" className="edit-label">
            Ubicación:
          </label>
          <input
            type="text"
            id="ubicacionPunto"
            ref={UbicacionPunto}
            required
            className="edit-input-field"
          />
        </div>
        <div className="edit-input">
          <label htmlFor="galeria" className="edit-label">
            Imagen:
          </label>
          <input
            type="file"
            id="galeria"
            ref={Galeria}
            accept="image/*"
            className="edit-input-field"
          />
        </div>
        <div className="divBotonPunto">
          <button className="btnGuardarPunto" type="submit">
            Guardar
          </button>
          
        </div>
        <div className="center-button-volver-usuarios">
        <button type="button" onClick={() => navigate('/listaPuntos')}>
            Volver
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditarPunto;
