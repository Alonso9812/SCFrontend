import '../../../Styles/Navbar.css';
import Logout from '../../Login/logout';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#"></a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="https://senderocornizuelo.xyz/">Sendero</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://www.cemede.una.ac.cr/">CEMEDE</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://senderocornizuelo.xyz/info/campanas/">Campañas</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://senderocornizuelo.xyz/info/voluntariado/">Voluntariados</a>
            </li>
            <div className='UbiC'>
          <Logout/>
          </div>
          </ul>
          
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

