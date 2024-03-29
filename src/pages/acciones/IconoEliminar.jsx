/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const IconoEliminar = ({ onDelete }) => {
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  const handleMouseEnter = () => {
    setMostrarMensaje(true);
  };

  const handleMouseLeave = () => {
    setMostrarMensaje(false);
  };

  return (
    <div>
      <span
        className="icono-eliminar"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onDelete}
       
      >
        <span style={{ color: 'black' }}>
             <FontAwesomeIcon icon="trash" />
                    </span> 
    
      </span>
      {mostrarMensaje && <span>Eliminar</span>}
    </div>
  );
};

export default IconoEliminar;
