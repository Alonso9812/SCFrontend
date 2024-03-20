import { useParams } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { updateReserva, getReservacionesID } from '../../services/ReservacionesServicios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EditReservaciones = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const ReservacionesFechaReserva = useRef(null);
  const mutationKey = `reservaciones-update/${id}`;
  const mutation = useMutation(mutationKey, updateReserva, {
    onSettled: () => queryClient.invalidateQueries(mutationKey),
  });
  const navigate = useNavigate();

  const handleRegistro = async (event) => {
    event.preventDefault();

    let newData = {
      id: id,
      fechaReserva: ReservacionesFechaReserva.current.value,
    };

    try {
      // Enviar la solicitud de actualización al servidor
      await mutation.mutateAsync(newData);
      // Mostrar el toast después de editar correctamente
      toast.success('¡Guardado Exitosamente!', {
        position: toast.POSITION.TOP_RIGHT,
      });
      // Esperar un breve período de tiempo antes de redirigir
      setTimeout(() => {
        navigate("/dashboard/listaReservaciones");
      }, 2000); // Redirigir después de 2 segundos (ajusta este valor según sea necesario)
    } catch (error) {
      console.error('Error en la solicitud Axios:', error);
    }
  };

  useEffect(() => {
    async function cargarDatosReserva() {
      try {
        const datosReserva = await getReservacionesID(id);
        ReservacionesFechaReserva.current.value = datosReserva.fechaReserva;
      } catch (error) {
        console.error(error);
      }
    }

    cargarDatosReserva();
  }, [id]);

  return (
    <div className="container">
      <div className="reservacioness">
        <h1>Editar Reservación</h1>
        <p>ID de la reserva a editar: {id}</p>
        <form onSubmit={handleRegistro}>
          <div className='PosicionEditarReservacion'>
            <label htmlFor="fechaReserva">Fecha de Reservación:</label>
            <input type="datetime-local" id="fechaReserva" ref={ReservacionesFechaReserva} required />
          </div>
          <div className="button-EditR">
            <button type="submit">Guardar</button>
          </div>
          <div className="center-button-editar-reservacion">
            <button type="button" onClick={() => navigate('/dashboard/listaReservaciones')}>Volver</button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default EditReservaciones;
