import { useRef } from "react"; // Agregamos useEffect
import { useMutation, useQueryClient } from "react-query";
import { create } from "../../services/TiposServicios"; // Agregamos getUser para obtener los datos del usuario
import { toast, ToastContainer } from "react-toastify";

const CrearTipo = () => {
  const queryClient = useQueryClient();
  const nombreTipoRef = useRef(null);

  const mutation = useMutation("create-tipoVolCamp", create, {
    onSettled: () => queryClient.invalidateQueries("create-tipoVolCamp"),
    mutationKey: "create-tipoVolCamp",
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
      nombreTipo: nombreTipoRef.current.value,
    };

    await mutation.mutateAsync(newUsuario);

    toast.success("¡Guardado Exitosamente!", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  return (
    <div className="container">
      <div className="CrearTipo">
        <h2>Crear Tipo Voluntariado/Campaña</h2>
        <form onSubmit={handleRegistro}>
          <div>
            <label htmlFor="nombreTipo">Nombre:</label>
            <input type="text" id="nombreTipo" ref={nombreTipoRef} required />
          </div>
          <div className="center-buton">
            <button type="submit">Registrarse</button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default CrearTipo;
