import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as FaIcons from 'react-icons/im';
import * as FaIconsd from 'react-icons/fa';
import * as FaIconsc from 'react-icons/md';
import * as FaIconscs from 'react-icons/ai';
import * as FaIconsci from 'react-icons/md';
import * as FaIconsce from 'react-icons/bs';
import Icon from '../../../assets/img/SENDERO-CORNIZUELO.png';



const Sidebar = ({ children }) => {
  const [sidebarVisible] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  //const [selectedParticipacion, setSelectedParticipacion] = useState('');


  useEffect(() => {
    // Verificar si hay un token en el localStorage al cargar el componente
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

 

  const navLinks = [
    { to: '/home', text: 'Inicio', icon: <FaIcons.ImHome className="icon" />, visible: isAuthenticated },
    { to: '/listUsuarios', text: 'Usuarios', icon: <FaIconsd.FaUsers className="icon" />, visible: isAuthenticated },
    { to: '/listaCampanas', text: 'Campañas', icon: <FaIconsc.MdNewspaper className="icon" />, visible: isAuthenticated },
    { to: '/listaReservaciones', text: 'Reservaciones', icon: <FaIconscs.AiOutlineAudit className="icon" />, visible: isAuthenticated },
    { to: '/listaTipos', text: 'TipoVC', icon: <FaIconsci.MdVolunteerActivism className="icon" />, visible: isAuthenticated },
    { to: '/listaVoluntariados', text: 'Voluntariados', icon: <FaIconsce.BsFillFileEarmarkTextFill className="icon" />, visible: isAuthenticated },
    { to: '/listaPuntos', text: 'Puntos De Interés', icon: <FaIconsce.BsFillFileEarmarkTextFill className="icon" />, visible: isAuthenticated },
    { to: '/listaSolicitudes', text: 'Solicitudes', icon: <FaIconsce.BsFillFileEarmarkTextFill className="me-2" />, visible: isAuthenticated },
    { to: '/login', text: 'Inicio de Sesión', icon: <FaIconsd.FaUsers className="me-2" />, visible: !isAuthenticated },
    //{ to: '/logout', text: 'Cerrar Sesión', icon: <FaIconsd.FaUsers className="me-2" />, visible: isAuthenticated },
  ];

  // const ParticipacionLinks = [
  //   { to: 'ConsultarEnCampañas', text: 'En Campañas', visible: isAuthenticated },
  //   { to: 'ConsultarEnVoluntariados', text: 'En Voluntariados', visible: isAuthenticated },
  // ];

  // const handleConsultaChange = (event) => {
  //   setSelectedParticipacion(event.target.value);
  // };


  return (
    <div className="containerSidebar">
      <div style={{ width: sidebarVisible ? '224px' : '50px' }} className="sidebar">
        <div className="top_section">
          <div className="bars"></div>
        </div>
        <div className="logoContainer">
          <img src={Icon} alt="icon" className="logo" />
        </div>
        {navLinks
          .filter((link) => link.visible === undefined || link.visible)
          .map((item, index) => (
            <NavLink
              to={item.to}
              key={index}
              className="link"
              activeClassName="active"
            >
              <div className="icon">{item.icon}</div>
              <div style={{ display: sidebarVisible ? 'block' : 'none' }} className="link_text">
                {item.text}
              </div>
            </NavLink>
          ))}
          
          
          
          <div style={{ fontWeight: 'bold', marginLeft: '20px',marginTop: '10px', marginBottom: '10px', color: 'black', }}>Participantes:</div>
        
        {isAuthenticated && (  
          <NavLink to="ParticipantesEnCampañas" className="link" activeClassName="active">
          
            <div className="icon" style={{ color: 'red' }}>
              {/* Puedes agregar un icono aquí si lo tienes */}
            </div>
            <div style={{ display: sidebarVisible ? 'block' : 'none', color: 'black' }} className="link_text">
              En campaña
            </div>
          </NavLink>
        )}

          {isAuthenticated && (  
          <NavLink to="ParticipantesEnVoluntariados" className="link" activeClassName="active">
          
            <div className="icon" style={{ color: 'red' }}>
              {/* Puedes agregar un icono aquí si lo tienes */}
            </div>
            <div style={{ display: sidebarVisible ? 'block' : 'none', color: 'black' }} className="link_text">
              En Voluntariados
            </div>
          </NavLink>
        )}

        {isAuthenticated && (
          <NavLink to="logout" className="link" activeClassName="active">
            <div className="icon" style={{ color: 'red' }}>
              {/* Puedes agregar un icono aquí si lo tienes */}
            </div>
            <div style={{ display: sidebarVisible ? 'block' : 'none', color: 'darkred' }} className="link_text">
              Cerrar sesión
            </div>
          </NavLink>
        )}
      </div>
      <main>{children}</main>
    </div>
  );
};

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Sidebar;
