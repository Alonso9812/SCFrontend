import { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts';
import { getCampaña } from '../../services/CampanasServicios';

const chartSetting = {
  width: 500,
  height: 300,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: 'translate(-20px, 0)',
    },
  },
};

const valueFormatter = (value) => `${value}`;

export default function BarsDataset() {
  const [dataset, setDataset] = useState([]);

  useEffect(() => {
    async function fetchCampañas() {
      try {
        const campanas = await getCampaña(); 
        const contadorPorMes = contarCampañasPorMes(campanas); 
        const nuevoDataset = convertirContadorADataset(contadorPorMes); 
        setDataset(nuevoDataset); 
      } catch (error) {
        console.error('Error al obtener las campañas:', error);
      }
    }

    fetchCampañas();
  }, []);

  function contarCampañasPorMes(campanas) {
    const contadorPorMes = {};

    campanas.forEach(campana => {
      const fecha = new Date(campana.fecha); 
      const mes = fecha.getMonth() + 1;
      contadorPorMes[mes] = (contadorPorMes[mes] || 0) + 1;
    });

    return contadorPorMes;
  }

  function convertirContadorADataset(contadorPorMes) {
    const nombresMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    const nuevoDataset = Object.entries(contadorPorMes).map(([mes, cantidad]) => ({
      campañas: cantidad,
      month: nombresMeses[parseInt(mes) - 1], 
    }));

    return nuevoDataset;
  }

  return (
    <BarChart
      dataset={dataset}
      xAxis={[{ scaleType: 'band', dataKey: 'month' }]} 
      series={[{ dataKey: 'campañas', label: 'Cantidad de Campañas por mes', valueFormatter }]}
      colors={['purple']}
      {...chartSetting}
    />
  );
}
