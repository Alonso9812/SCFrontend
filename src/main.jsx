import React from "react";
import ReactDOM from "react-dom/client";
//estilos
import "./index.css";
import "./Styles/SidebarC.scss";
import "./Styles/Home.scss";
import "./Styles/Editar.css";
import "./Styles/EditCamp.css";
import "./Styles/editPunto.css";
import "./Styles/EditarTipo.css";
import "./Styles/EditarEstilos.css";
import "./Styles/EditarReservacion.css";
import "./Styles/EditarVoluntariado.css";
import "./Styles/nuevosPuntos.css";
// import './Styles/SidebarC.css'
import "./Styles/Botones.css";
import "./Styles/Campanas.css";
import "./Styles/Tablas.css";
import "./Styles/Login.css";
import "./Styles/Registro.css";
import "./Styles/Confirmacion.css";
import "./Styles/EditarTipo.css";
import "./Styles/CrearTipo.css";
import "./Styles/Puntos.css";
import "./Styles/Reservaciones.css";
import './Styles/table.css';
import './Styles/loginJWT.css';
//Rutas
import { Layout } from "./pages/_layout/Layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Campañas from "./pages/campanas/campanas";
import Home from "./pages/home/Home";
// import ListaVoluntarios from './pages/voluntarios/listaVoluntarios'
import ListUsuarios from "./pages/Usuarios/ListUsuarios";
import ListaRoles from "./pages/Roles/listRoles";
import Login from "./pages/Login/Login";
import Registro from "./pages/Login/Registro";
import AgregarUsuAdmin from "./pages/Usuarios/AgregarUsuAdmin";
import EditarUsuario from "./pages/Usuarios/EditarUsuario";
import Reservacion from "./pages/reservaciones/Reservacion";
import ListaReservaciones from "./pages/reservaciones/listaReservaciones";
import ListaCampanas from "./pages/campanas/listaCampanas";
import EditarCampaña from "./pages/campanas/editarCampana";
import EditReservaciones from "./pages/reservaciones/EditReservaciones";
import ListaTipos from "./pages/tipoVC/listaTipo";
import EditarTipo from "./pages/tipoVC/EditarTipo";
import CrearTipo from "./pages/tipoVC/CrearTipo";

import ListaPuntos from "./pages/nuevosPuntos/listaPuntos";
import NuevoPuntoForm from "./pages/nuevosPuntos/NuevoPuntoForm";
import EditarPunto from "./pages/nuevosPuntos/EditarPunto";
import VOluntariados from "./pages/voluntariados/voluntariado";
import EditarVOluntariado from "./pages/voluntariados/editarVoluntariado";
import ListaVOluntariados from "./pages/voluntariados/listaVOluntariados";
import ListaSolicitudes from './pages/solicitudes/listaSolicitudes'

import "bootstrap/scss/bootstrap.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import Logout from "./pages/Login/logout";
import ParticipantesVol from "./pages/voluntariados/ParticipantesVol";
import ParticipantesCamp from "./pages/campanas/ParticipantesCamp";
import AccessDeniedPage from "./pages/Login/AccessDeniedPage";
import { library } from '@fortawesome/fontawesome-svg-core';

import {faTrash , faEdit, faUser, faLock } from '@fortawesome/free-solid-svg-icons';


library.add(faTrash);
library.add(faEdit);
library.add(faUser);
library.add(faLock);


export const ThemeContext = React.createContext(null);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    
    <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/logout" element={<Logout />} />
  <Route path="/Registro" element={<Registro />} />
  <Route path="/access-denied" element={<AccessDeniedPage />} />
  
  <Route path="/dashboard/*" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="campañas" element={<Campañas />} />
    <Route path="listUsuarios" element={<ListUsuarios />} />
    <Route path="ListRoles" element={<ListaRoles />} />
    {/* Agrega las demás rutas aquí sin el prefijo inicial */}
    <Route path="user-update/:id" element={<EditarUsuario />} />
    <Route path="reservaciones" element={<Reservacion />} />
    <Route path="listaReservaciones" element={<ListaReservaciones />} />
    <Route path="reservaciones-update/:id" element={<EditReservaciones />} />
    <Route path="agregar-tipo-admin" element={<CrearTipo />} />
    <Route path="listaTipos" element={<ListaTipos />} />
    <Route path="update-tipo/:id" element={<EditarTipo />} />
    <Route path="listaPuntos" element={<ListaPuntos />} />
    <Route path="nuevoPuntoForm" element={<NuevoPuntoForm />} />
    <Route path="agregar-usuario-admin" element={<AgregarUsuAdmin />} />
    <Route path="listaCampanas" element={<ListaCampanas />} />
    <Route path="campana-update/:id" element={<EditarCampaña />} />
    <Route path="crear-campana-admin" element={<Campañas />} />
    <Route path="update-punto/:id" element={<EditarPunto />} />
    <Route path="crear-reservacion-admin" element={<Reservacion />} />
    <Route path="nuevo-punto-admin" element={<NuevoPuntoForm />} />
    <Route path="listaVOluntariados" element={<ListaVOluntariados />} />
    <Route path="listaSolicitudes" element={<ListaSolicitudes />} />
    <Route path="voluntariado-update/:id" element={<EditarVOluntariado />} />
    <Route path="voluntariados" element={<VOluntariados />} />
    <Route path="nuevo-voluntariados-admin" element={<VOluntariados />} />
    <Route path="ParticipantesEnVoluntariados" element={<ParticipantesVol />} />
    <Route path="ParticipantesEnCampañas" element={<ParticipantesCamp />} />
  </Route>
</Routes>

    </BrowserRouter>
  </React.StrictMode>
);
