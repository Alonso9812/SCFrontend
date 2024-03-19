import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

const NuevoPuntoForm = () => {
  const [nombrePunto, setNombrePunto] = useState("");
  const [descripcionPunto, setDescripcionPunto] = useState("");
  const [ubicacionPunto, setUbicacionPunto] = useState("");
  const [galeria, setGaleria] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombrePunto", nombrePunto);
    formData.append("descripcionPunto", descripcionPunto);
    formData.append("ubicacionPunto", ubicacionPunto);
    formData.append("galeria", galeria);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token no encontrado. El usuario no está autenticado.");
      }

      axios.defaults.baseURL = "http://127.0.0.1:8000/api/";

      const response = await axios.post("nuevo-punto", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.data.status === 1) {
        toast.success("Nuevo punto de interés creado exitosamente", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error("Error al crear el punto de interés", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        toast.error("No se puede subir esa imagen", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(`Error en la solicitud: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  
  return (
    <div className="nuevoPunto">
      <h2>Crear Nuevo Punto de Interés</h2>
      <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre del Punto:</label>
            <input
              type="text"
              value={nombrePunto}
              onChange={(e) => setNombrePunto(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Descripción:</label>
            <input
              value={descripcionPunto}
              onChange={(e) => setDescripcionPunto(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Ubicación:</label>
            <input
              type="text"
              value={ubicacionPunto}
              onChange={(e) => setUbicacionPunto(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Galería:</label>
            <input
              type="file"
              onChange={(e) => setGaleria(e.target.files[0])}
              required
            />
          </div>
          <div className="center-buttonn">
            <button type="submit">Crear</button>
          </div>
        </form>
        <button onClick={() => navigate('/dashboard/listaPuntos')}>Volver</button>
      <ToastContainer />
    </div>
  );
};

export default NuevoPuntoForm;
