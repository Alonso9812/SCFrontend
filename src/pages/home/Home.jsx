import PiesChart from "./PiesChart";
import BarsChart from "./BarsChart";
//import LinesChart from "./LinesChart";
// import PiesChartCircle from "./PiesChartCircle";
import Navbar from "../_layout/components/Navbar";

import '../../Styles/Cards.css';

function Home() {
  return (
    <div>
       <Navbar />
      <div className="charts-container">
        <div className="chart-card1">
          <div className="logoUNA">
            <img src="../../../public/WhatsApp Image 2024-03-20 at 4.43.03 PM.jpeg" alt="icon" className="logo" />
            <img src="../../../public/LOGOCEMEDE.png" alt="icon" className="logo" />
            <img src="../../../public/SENDERO-CORNIZUELO.webp" alt="icon" className="logo" />
          </div>
          <div className="justified-text">
            <p>
              Sistema de administracion web senderoconizuelo donde se llevara acabo las gestiones de los diferentes modulos,
              Aceptar solicitudes de campañas, reservaciones para la visita del senderon así tambien gestionar sus voluntarios.
            </p>
          </div>
        </div>
        <div className="chart-card">
          <PiesChart />
        </div>
        <div className="chart-card3">
          <BarsChart /> 
        </div>
      </div>
    </div>
  );
}

export default Home;

