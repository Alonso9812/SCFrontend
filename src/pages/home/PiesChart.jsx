import  { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts';
import { getTotalVoluntariados } from '../../services/VOluntariadosServicios';
import { getTotalReservaciones } from '../../services/ReservacionesServicios';
import { getTotalSolicitudes } from '../../services/SolicitudServicio';
import { getTotalCampanas } from '../../services/CampanasServicios';

function PiesChart() {

    const [totalVoluntariados, setTotalVoluntariados] = useState(0);
    const [totalResrvaciones, setTotalReservaciones] = useState(0);
    const [totalSolicitudes, setTotalSolicitudes] = useState(0);
    const [totalCampanas, setTotalCampanas] = useState(0);
    
    
    useEffect(() => {
      const fetchTotalCampanas = async () => {
        const total = await getTotalCampanas();
        setTotalCampanas(total);
      };
  
      fetchTotalCampanas();
    }, []);

    useEffect(() => {
      const fetchTotalVoluntariados = async () => {
        const total = await getTotalVoluntariados();
        setTotalVoluntariados(total);
      };
  
      fetchTotalVoluntariados();
    }, []);
  
    useEffect(() => {
      const fetchTotalReservaciones = async () => {
        const total = await getTotalReservaciones();
        setTotalReservaciones(total);
      };
  
      fetchTotalReservaciones();
    }, []);
  
    useEffect(() => {
      const fetchTotalSolicitudes = async () => {
        const total = await getTotalSolicitudes();
        setTotalSolicitudes(total);
      };
  
      fetchTotalSolicitudes();
    }, []);

  return (
    <PieChart
    colors={['#084081', '#7a7a7a', '#bb151a', 'black']}
    series={[
      {
        data: [
          { id: 0, value: totalResrvaciones, label: 'Reservaciones' },
          { id: 1, value: totalVoluntariados, label: 'Voluntariado' },
          { id: 2, value: totalSolicitudes, label: 'Solicitudes' },
          { id: 3, value: totalCampanas, label: 'Campañas' },
        ],
        highlightScope: { faded: 'global', highlighted: 'item' },
        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
      },
    ]}
        
    />
  )
}

export default PiesChart