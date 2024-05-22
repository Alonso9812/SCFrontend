import PiesChart from "./PiesChart";
import BarsChart from "./BarsChart";
import LinesChart from "./LinesChart";
//import PiesChartCircle from "./PiesChartCircle";
import NavbarNav from "../_layout/components/Navbar";

import '../../Styles/Cards.css';

function Home() {
  return (
    <div>
      <NavbarNav />
      <div className="charts-container">
        <div className="chart-card">
          <div className="logoContainer">
            <img src="../../assets/img/LOGOCEMEDE.png" alt="icon" className="logo" />
          </div>
        </div>
        <div className="chart-card">
          <BarsChart />
        </div>
        <div className="chart-card">
          <PiesChart />
        </div>
        <div className="chart-card">
          <LinesChart />
        </div>
      </div>
    </div>
  );
}

export default Home;


