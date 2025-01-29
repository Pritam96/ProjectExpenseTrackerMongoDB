import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaUserPlus,
  FaWallet,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="d-flex align-items-center">
              <FaWallet className="me-2" size={25} />
              ExpenseTracker
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {user ? (
                <>
                  <LinkContainer to="/expense">
                    <Nav.Link className="d-flex align-items-center">
                      Expenses
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/export">
                    <Nav.Link className="d-flex align-items-center">
                      Export
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/reports">
                    <Nav.Link className="d-flex align-items-center">
                      Reports
                    </Nav.Link>
                  </LinkContainer>

                  <NavDropdown
                    title={`Welcome, ${user.username || "User"}`}
                    id="user-dropdown"
                    menualign="end"
                  >
                    <NavDropdown.Item onClick={logoutHandler}>
                      <FaSignOutAlt className="me-2" size={18} />
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <LinkContainer to="/login">
                    <Nav.Link className="d-flex align-items-center">
                      <FaSignInAlt className="me-2" size={20} />
                      Login
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/register">
                    <Nav.Link className="d-flex align-items-center">
                      <FaUserPlus className="me-2" size={20} />
                      Register
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
