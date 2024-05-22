import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import Logout from '../../Login/logout';


export default class NavbarNav extends React.Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  
  render() {
    return (
      <div>
        <Navbar color="lbg-light" light expand="md" className="mb-3" style={{ height: '60px', boxShadow:  '2px 2px 5px rgba(0, 0, 0, 0.2)'}}>
          <Nav className='Nameli' href="/home" style={{ marginLeft: "275px"}}>Sendero El Cornizuelo</Nav>  
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ms-auto" navbar>
              <NavItem>
                <NavLink className='comp' href="https://senderocornizuelo.xyz/info/">Inicio</NavLink>
              </NavItem>
              <NavItem>
                <NavLink className='comp' href="/components/">Components</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/login">naadaaa</NavLink>
              </NavItem>
            </Nav>
            <NavItem>
              <Logout />
            </NavItem>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}
