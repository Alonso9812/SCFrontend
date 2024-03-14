import React, { useRef } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { create } from '../../services/Voluntarios'; // Importa el servicio para crear voluntarios
import { toast, ToastContainer } from 'react-toastify';

const Voluntario = () => {
  const queryClient = useQueryClient();
  const nombreRef = useRef(null);
  const apellido1Ref = useRef(null);
  const apellido2Ref = useRef(null);
  const añoIngresoRef = useRef(null);
  const carreraRef = useRef(null);

  const mutation = useMutation("create-voluntario", create, {
    onSettled: () => queryClient.invalidateQueries("create-voluntario"),
    mutationKey: "create-voluntario",
    onError: (error) => {
      toast.error('Error al guardar: ' + error.message, {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  });

  const handleRegistro = async (e) => {
    e.preventDefault();

    let newVoluntario = {
      Nombre: nombreRef.current.value,
      Apellido1: apellido1Ref.current.value,
      Apellido2: apellido2Ref.current.value,
      AñoIngreso: añoIngresoRef.current.value,
      Carrera: carreraRef.current.value
    };

    await mutation.mutateAsync(newVoluntario);

    toast.success('¡Guardado Exitosamente!', {
      position: toast.POSITION.TOP_RIGHT
    });
  };

  return (
    <div className="registro">
      <h2>Registrar Voluntario</h2>
      <form onSubmit={handleRegistro}>
        <div>
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            ref={nombreRef}
            required
          />
        </div>
        <div>
          <label htmlFor="apellido1">Primer Apellido:</label>
          <input
            type="text"
            id="apellido1"
            ref={apellido1Ref}
            required
          />
        </div>
        <div>
          <label htmlFor="apellido2">Segundo Apellido:</label>
          <input
            type="text"
            id="apellido2"
            ref={apellido2Ref}
            required
          />
        </div>
        <div>
          <label htmlFor="añoIngreso">Año de Ingreso:</label>
          <input
            type="number"
            id="añoIngreso"
            ref={añoIngresoRef}
            required
          />
        </div>
        <div>
          <label htmlFor="carrera">Carrera:</label>
          <input
            type="text"
            id="carrera"
            ref={carreraRef}
            required
          />
        </div>
        <button type="submit">Registrar</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Voluntario;
