import {
  Container,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
  NavLink,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaSignInAlt, FaUserPlus, FaWallet } from "react-icons/fa";

const Header = () => {
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <NavbarBrand className="d-flex align-items-center">
              <FaWallet className="me-2" size={25} />
              ExpenseTracker
            </NavbarBrand>
          </LinkContainer>
          <NavbarToggle aria-controls="basic-navbar-nav" />
          <NavbarCollapse>
            <Nav className="ms-auto">
              <LinkContainer to="/login">
                <NavLink className="d-flex align-items-center">
                  <FaSignInAlt className="me-2" size={20} />
                  Login
                </NavLink>
              </LinkContainer>
              <LinkContainer to="/register">
                <NavLink className="d-flex align-items-center">
                  <FaUserPlus className="me-2" size={20} /> Register
                </NavLink>
              </LinkContainer>
            </Nav>
          </NavbarCollapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
