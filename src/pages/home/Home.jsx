import { useState } from 'react';
import "../../Styles/Home.scss";

const Home = () => {
    const [nuevosPuntosData, setNuevosPuntosData] = useState([]);

    // Suponiendo que nuevosPuntosData es un array con los datos de NuevosPuntos
    const contadorNuevosPuntos = nuevosPuntosData.length;

    return (
        <div className="home-container">
            {/* Card para mostrar el contador */}
            <div className="card card-1">
                <h5>Registros en NuevosPuntos</h5>
                <p>Contador de registros: {contadorNuevosPuntos}</p>
            </div>
        </div>
    );
};

export default Home;
