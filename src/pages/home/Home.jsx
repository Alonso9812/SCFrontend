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
            <img src="../../../public/UNA.webp" alt="icon" className="logo logo-una" />
            <img src="../../../public/LOGOCEMEDE.png" alt="icon" className="logo logo-cemede" />
            <img src="../../../public/SENDERO-CORNIZUELO-6398d8d8.webp" alt="icon" className="logo logo-sendero" />
          </div>
          <div className="justified-text">
            <p>
              Sistema web para gestionar reservaciones de citas, campañas y voluntariados
              optimiza la organización, mejora la eficiencia, y facilita la comunicación.
              Permite a los usuarios agendar citas, inscribirse en campañas y coordinar
              voluntariados de manera sencilla y centralizada.
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
