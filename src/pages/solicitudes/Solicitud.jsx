import { useRef } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { create } from '../../services/SolicitudServicio';
import { toast, ToastContainer } from 'react-toastify';

const Solicitud = () => {
  const queryClient = useQueryClient();
  const nomSoliRef = useRef(null);
  const apellSoli1Ref = useRef(null);
  const apellSoli2Ref = useRef(null);
  const numSoliRef = useRef(null);
  const emailRef = useRef(null);
  const tituloVCRef = useRef(null);
  const descripVCRef = useRef(null);
  const lugarVCRef = useRef(null);
  const alimentacionRef = useRef(null); // Cambiado a combobox
  const tipoSoliRef = useRef(null);
  const fechaSoliRef = useRef(null);

  const mutation = useMutation("crear-solicitud", create, {
    onSettled: () => queryClient.invalidateQueries("crear-solicitud"),
    mutationKey: "crear-solicitud",
    onError: (error) => {
      toast.error('Error al guardar: ' + error.message, {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  });

  const handleRegistro = async (e) => {
    e.preventDefault();

    // Realiza la validación del formulario aquí

    let newSolicitud = {
      nomSoli: nomSoliRef.current.value,
      apellSoli1: apellSoli1Ref.current.value,
      apellSoli2: apellSoli2Ref.current.value,
      numSoli: numSoliRef.current.value,
      email: emailRef.current.value,
      tituloVC: tituloVCRef.current.value,
      descripVC: descripVCRef.current.value,
      lugarVC: lugarVCRef.current.value,
      alimentacion: alimentacionRef.current.value, // Cambiado a combobox
      tipoSoli: tipoSoliRef.current.value,
      fechaSoli: fechaSoliRef.current.value,
    };

    await mutation.mutateAsync(newSolicitud);

    toast.success('¡Guardado Exitosamente!', {
      position: toast.POSITION.TOP_RIGHT
    });
  };

  return (
    <div className="CrearSoli">
      <h2>Crear Solicitud Voluntariado/Campaña</h2>
      <form onSubmit={handleRegistro}>
        <div className='div-input-tipo'>
          <label htmlFor="nombreSolicitante">Nombre:</label>
          <input
            type="text"
            id="nombreSolicitante"
            ref={nomSoliRef}
            required
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="apellSoli1">Apellido 1:</label>
          <input
            type="text"
            id="apellSoli1"
            ref={apellSoli1Ref}
            required
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="apellSoli2">Apellido 2:</label>
          <input
            type="text"
            id="apellSoli2"
            ref={apellSoli2Ref}
            required
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="numSoli">Número de Solicitud:</label>
          <input
            type="text"
            id="numSoli"
            ref={numSoliRef}
            required
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            ref={emailRef}
            required
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="tituloVC">Título de Voluntariado/Campaña:</label>
          <input
            type="text"
            id="tituloVC"
            ref={tituloVCRef}
            required
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="descripVC">Descripción de Voluntariado/Campaña:</label>
          <input
            type="text"
            id="descripVC"
            ref={descripVCRef}
            required
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="lugarVC">Lugar de Voluntariado/Campaña:</label>
          <input
            type="text"
            id="lugarVC"
            ref={lugarVCRef}
            required
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="alimentacion">Requiere Alimentación:</label>
          <select id="alimentacion" ref={alimentacionRef} required>
            <option value="Si">Sí</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="tipoSoli">Tipo de Solicitud:</label>
          <input
            type="text"
            id="tipoSoli"
            ref={tipoSoliRef}
            required
          />
        </div>
        <div className='div-input-tipo'>
          <label htmlFor="fechaSoli">Fecha de Solicitud:</label>
          <input
            type="datetime-local"
            id="fechaSoli"
            ref={fechaSoliRef}
            required
          />
        </div>
        <div className="center-buton">
          <button type="submit">crear</button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Solicitud;