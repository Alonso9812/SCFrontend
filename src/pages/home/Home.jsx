import  { useState, useEffect } from "react";
import "../../Styles/card.css"; 
import axios from 'axios';

const Home = () => {

  const [contadorRegistros, setContadorRegistros] = useState(null);

  const obtenerContadorRegistros = async () => {
    try {
      const response = await axios.get('/contar-registros');
      setContadorRegistros(response.data.num_registros);
    } catch (error) {
      console.error('Error al obtener el contador de registros:', error);
    }
  };

  useEffect(() => {
    obtenerContadorRegistros();
  }, []);

  return (
  <h1>kslkdfjnslkfdnkldsfgnlkdsgnv lkjnvb kjedsnvblk.j</h1>
  );
};

export default Home;