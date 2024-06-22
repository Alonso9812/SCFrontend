import { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts';
import { getCampaña } from '../../services/CampanasServicios';
import { getVOluntariado } from '../../services/VOluntariadosServicios';

const chartSetting = {
  width: 700,
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
    async function fetchData() {
      try {
        const [campanas, voluntariados] = await Promise.all([getCampaña(), getVOluntariado()]);

        const contadorCampanas = contarPorMes(campanas);
        const contadorVoluntariados = contarPorMes(voluntariados);

        const nuevoDataset = convertirContadorADataset(contadorCampanas, contadorVoluntariados);
        setDataset(nuevoDataset);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    }

    fetchData();
  }, []);

  function contarPorMes(datos) {
    const contadorPorMes = {};

    datos.forEach(dato => {
      const fecha = new Date(dato.fecha);
      const mes = fecha.getMonth() + 1;
      contadorPorMes[mes] = (contadorPorMes[mes] || 0) + 1;
    });

    return contadorPorMes;
  }

  function convertirContadorADataset(contadorCampanas, contadorVoluntariados) {
    const nombresMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const nuevoDataset = nombresMeses.map((mes, index) => {
      const mesIndex = index + 1;
      return {
        month: mes,
        campañas: contadorCampanas[mesIndex] || 0,
        voluntariados: contadorVoluntariados[mesIndex] || 0,
      };
    });

    return nuevoDataset;
  }
  

  return (
    <BarChart
      dataset={dataset}
      xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
      series={[
        { dataKey: 'campañas', label: 'Camp', valueFormatter },
        { dataKey: 'voluntariados', label: 'Volun', valueFormatter },
      ]}
      colors={['#084081', '#FF5733']} 
      {...chartSetting}
    />
  );
}
