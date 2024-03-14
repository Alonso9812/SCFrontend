import { useParams } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react'; 
import { useMutation, useQueryClient } from 'react-query';
import { updateUsuario, getUsuariosID } from '../../services/UsuariosServicios'; 
import { toast, ToastContainer } from 'react-toastify';

const EditUsuario = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  
  const UsuarioNombre = useRef(null);
  const UsuarioApe1 = useRef(null);
  const UsuarioApe2 = useRef(null);
  const UsuarioCedula = useRef(null);
  const UsuarioNumero = useRef(null);
  const UsuarioOcupacion = useRef(null);
  const UsuarioRol = useRef(null);
  const UsuarioEmail = useRef(null);
  const UsuarioPassword = useRef(null);

  const [selectedRol, setSelectedRol] = useState(''); // Estado para almacenar el rol seleccionado

  const mutationKey = `user-update/${id}`;
  const mutation = useMutation(mutationKey, updateUsuario, {
    onSettled: () => queryClient.invalidateQueries(mutationKey),
  });


 

  const handleRegistro = (event) => {
    event.preventDefault();
    
    let newData = {
      id: id,
      nombre: UsuarioNombre.current.value,
      apell1: UsuarioApe1.current.value,
      apell2: UsuarioApe2.current.value,
      cedula: UsuarioCedula.current.value,
      numero: UsuarioNumero.current.value,
      ocupacion: UsuarioOcupacion.current.value,
      rol: selectedRol, // Usamos el valor seleccionado del estado
      email: UsuarioEmail.current.value,
      password: UsuarioPassword.current.value,
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
    async function cargarDatosUsuario() {
      try {
        const datosUsuario = await getUsuariosID(id);
        UsuarioNombre.current.value = datosUsuario.nombre;
        UsuarioApe1.current.value = datosUsuario.apell1;
        UsuarioApe2.current.value = datosUsuario.apell2;
        UsuarioCedula.current.value = datosUsuario.cedula;
        UsuarioNumero.current.value = datosUsuario.numero;
        UsuarioOcupacion.current.value = datosUsuario.ocupacion;
        setSelectedRol(datosUsuario.rol); // Establecer el valor seleccionado en el estado
        UsuarioEmail.current.value = datosUsuario.email;
        UsuarioPassword.current.value = datosUsuario.password;
      } catch (error) {
        console.error(error);
      }
    }

    cargarDatosUsuario();
  }, [id]);

  return (
    <div className="container">
      <div className="registroEditar">
        <h2>Editar Usuario</h2>
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
          <div className="edit-input">
          <label htmlFor="rol" className="edit-label">Rol:</label>
          <select
            id="rol"
            ref={UsuarioRol}
            value={selectedRol}
            onChange={(e) => setSelectedRol(e.target.value)}
            required
            className="edit-input-field"
          >
            <option value="Admin">Admin</option>
            <option value="Voluntario">Voluntario</option>
          </select>
          </div>

          <div>
            <label htmlFor="correo">Correo:</label>
            <input type="email" id="correo" ref={UsuarioEmail} required />
          </div>
          <div className='edit-input'>
            <label htmlFor="contrasena" className='edit-label'>Contraseña:</label>
            <input
              type="password"
              id="contrasena"
              ref={UsuarioPassword}
              required
              className='edit-input-field'
            />
            </div>
          <div className="center-button">
            <button type="submit">Editar</button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};


export default EditUsuario;
