import { useRef } from "react"; // Agregamos useEffect
import { useMutation, useQueryClient } from "react-query";
import { create } from "../../services/ReservacionesServicios"; // Agregamos getUser para obtener los datos del usuario
import { toast, ToastContainer } from "react-toastify";

const Reservacion = () => {
  const queryClient = useQueryClient();
  const nombreRef = useRef(null);
  const apellido1Ref = useRef(null);
  const apellido2Ref = useRef(null);
  const cedulaRef = useRef(null);
  const fechaReservaRef = useRef(null);
  const cupoRef = useRef(null);
  const telefonoRef = useRef(null);
  const emailRef = useRef(null);

  const mutation = useMutation("create-reservacion", create, {
    onSettled: () => queryClient.invalidateQueries("create-reservacion"),
    mutationKey: "create-reservacion",
    onError: (error) => {
      toast.error("Error al guardar: " + error.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    },
  });

  const handleRegistro = async (e) => {
    e.preventDefault();

    // Realiza la validación del formulario aquí

    let newUsuario = {
      nombreVis: nombreRef.current.value,
      apell1Vis: apellido1Ref.current.value,
      apell2Vis: apellido2Ref.current.value,
      cedulaVis: cedulaRef.current.value,
      fechaReserva: fechaReservaRef.current.value,
      cupo: cupoRef.current.value,
      telefonoVis: telefonoRef.current.value,
      email: emailRef.current.value,
    };

    await mutation.mutateAsync(newUsuario);

    toast.success("¡Guardado Exitosamente!", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  return (
    <div className="container">
      <div className="reservaciones">
        <h2>Reservar Tour</h2>
        <form onSubmit={handleRegistro}>
          <div>
            <label htmlFor="nombreVis">Nombre:</label>
            <input type="text" id="nombreVis" ref={nombreRef} required />
          </div>
          <div>
            <label htmlFor="apeVis1">Primer Apellido:</label>
            <input type="text" id="apeVis1" ref={apellido1Ref} required />
          </div>
          <div>
            <label htmlFor="apeVis2">Segundo Apellido:</label>
            <input type="text" id="apeVis2" ref={apellido2Ref} required />
          </div>
          <div>
            <label htmlFor="cedulaVis">Cédula:</label>
            <input type="text" id="cedulaVis" ref={cedulaRef} required />
          </div>
          <div>
            <label htmlFor="fechaReserva">Fecha Reservacion:</label>
            <input
              type="Date"
              id="fechaReserva"
              ref={fechaReservaRef}
              required
            />
          </div>
          <div>
            <label htmlFor="cupo">Cupo:</label>
            <input type="text" id="cupo" ref={cupoRef} required />
          </div>
          <div>
            <label htmlFor="telefonoVis">Telefono:</label>
            <input type="text" id="telefonoVis" ref={telefonoRef} required />
          </div>

          <div>
            <label htmlFor="correoVis">Correo:</label>
            <input type="email" id="correoVis" ref={emailRef} required />
          </div>
          <div className="centerr-button">
            <button type="submit">Reservar</button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Reservacion;
