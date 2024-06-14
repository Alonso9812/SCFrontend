import { useRef } from "react";
import { useMutation, useQueryClient } from "react-query";
import { create } from "../../services/UsuariosServicios";
import { useNavigate } from "react-router-dom"; // Cambiar la importación aquí
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Registro = () => {
  const queryClient = useQueryClient();
  const UsuarioNombre = useRef(null);
  const UsuarioApe1 = useRef(null);
  const UsuarioApe2 = useRef(null);
  const UsuarioCedula = useRef(null);
  const UsuarioNumero = useRef(null);
  const UsuarioOcupacion = useRef(null);
  const UsuarioEmail = useRef(null);
  const UsuarioPassword = useRef(null);


  const navigate = useNavigate(); // Usar useNavigate aquí

  const mutation = useMutation("register", create, {
    onSettled: () => queryClient.invalidateQueries("register"),
  });

  const handleRegistro = async (e) => {
    e.preventDefault();

    const newUsuario = {
      name: UsuarioNombre.current.value,
      apell1: UsuarioApe1.current.value,
      apell2: UsuarioApe2.current.value,
      cedula: UsuarioCedula.current.value,
      numero: UsuarioNumero.current.value,
      ocupacion: UsuarioOcupacion.current.value,
      status: "activo",
      email: UsuarioEmail.current.value,
      password: UsuarioPassword.current.value,
    };

    console.log(newUsuario);

    try {
      await mutation.mutateAsync(newUsuario);
      toast.success("¡Guardado Exitosamente!", {
        position: toast.POSITION.TOP_RIGHT,
        
      });
      setTimeout(() => {
        navigate("/dashboard/listUsuarios");
      }, 2000);
      
    } catch (error) {
      toast.error(`Error al crear el usuario: ${error.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleVolver = () => {
    navigate("/dashboard/listUsuarios");
  };

  return (
    <div className="container">
      <div className="registro">
        <h2>Registro</h2>
        <form onSubmit={handleRegistro}>
          <div>
            <label htmlFor="nombre">Nombre:</label>
            <input type="text" id="nombre" ref={UsuarioNombre} required />
          </div>
          <div>
            <label htmlFor="primerApellido">Primer Apellido:</label>
            <input type="text" id="primerApellido" ref={UsuarioApe1} required />
          </div>
          <div>
            <label htmlFor="segundoApellido">Segundo Apellido:</label>
            <input
              type="text"
              id="segundoApellido"
              ref={UsuarioApe2}
              required
            />
          </div>
          <div>
            <label htmlFor="cedula">Cédula:</label>
            <input type="text" id="cedula" ref={UsuarioCedula} required />
          </div>
          <div>
            <label htmlFor="numero">Telefono:</label>
            <input type="text" id="numero" ref={UsuarioNumero} required />
          </div>
          <div>
            <label htmlFor="ocupacion">Ocupación:</label>
            <input type="text" id="ocupacion" ref={UsuarioOcupacion} required />
          </div>
          <div>
            <label htmlFor="correo">Correo:</label>
            <input className="iptCorreo" type="email" id="correo" ref={UsuarioEmail} required />
          </div>
          <div>
            <label htmlFor="contrasena">Contraseña:</label>
            <input className="pswdUsuario"
              type="password"
              id="contrasena"
              ref={UsuarioPassword}
              required
            />
          </div>
          <div className="center-button-registrar">
            <button type="button" onClick={handleVolver}>Volver</button>
          </div>
          <div className="center-button-registro">
          <button type="submit" >guardar</button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>

  );
};

export default Registro;