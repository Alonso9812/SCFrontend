import { useParams } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { updateReserva, getReservacionesID } from '../../services/ReservacionesServicios'; // Importamos funciones de servicio para las reservas
import { toast, ToastContainer } from 'react-toastify';

const EditReservaciones = () => {
  const { id } = useParams(); // Obtener el ID de la reserva de la URL

  const queryClient = useQueryClient();
  const ReservacionesFechaReserva = useRef(null);
  const ReservacionesCupo = useRef(null);
  const Reservacionesstatus = useRef(null);

  const mutationKey = `reservaciones-update/${id}`;
  const mutation = useMutation(mutationKey, updateReserva, {
    onSettled: () => queryClient.invalidateQueries(mutationKey),
  });

  const opcionesStatus = ["Nueva", "Terminada", "Cancelada"];

  const handleRegistro = (event) => {
    event.preventDefault();

    let newData = {
      id: id,
      fechaReserva: ReservacionesFechaReserva.current.value,
      Cupo: ReservacionesCupo.current.value,
      status: Reservacionesstatus.current.value,
    };

    console.log(newData);
    // Enviar la solicitud de actualización al servidor
    mutation.mutateAsync(newData)
      .catch((error) => {
        console.error('Error en la solicitud Axios:', error);
      });

    toast.success('¡Guardado Exitosamente!', {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  useEffect(() => {
    // Cargamos los datos de la reserva al montar el componente
    async function cargarDatosReserva() {
      try {
        const datosReserva = await getReservacionesID(id); // Utilizamos una función para obtener los datos de la reserva
        ReservacionesFechaReserva.current.value = datosReserva.fechaReserva;
        ReservacionesCupo.current.value = datosReserva.Cupo;
        Reservacionesstatus.current.value = datosReserva.status;
      } catch (error) {
        console.error(error);
      }
    }

    cargarDatosReserva();
  }, [id]);

  return (



<div className="container">
      <div className="reservacioness">
      <h1>Editar Reserva</h1>
      <p>ID de la reserva a editar: {id}</p>
        <form onSubmit={handleRegistro}>
        <div>
          <label htmlFor="fechaReserva">Fecha de Reserva:</label>
          <input type="date" id="fechaReserva" ref={ReservacionesFechaReserva} required />
        </div>

        <div>
          <label htmlFor="Cupo">Cupo:</label>
          <input type="number" id="Cupo" ref={ReservacionesCupo} required />
        </div>

        <div>
          <label htmlFor="status">Estado:</label>
          <select id="status" ref={Reservacionesstatus} required>
            {opcionesStatus.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </div>

          <div className="button-EditR">
            <button type="submit">Guardar</button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default EditReservaciones;