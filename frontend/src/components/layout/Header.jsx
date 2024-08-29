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
            <NavbarBrand className="d-flex align-items-center">
              <FaWallet className="me-2" size={25} />
              ExpenseTracker
            </NavbarBrand>
          </LinkContainer>
          <NavbarToggle aria-controls="basic-navbar-nav" />
          <NavbarCollapse>
            <Nav className="ms-auto">
              {user ? (
                <>
                  <LinkContainer to="/expense">
                    <NavLink className="d-flex align-items-center">
                      Expenses
                    </NavLink>
                  </LinkContainer>
                  <LinkContainer to="/export">
                    <NavLink className="d-flex align-items-center">
                      Export
                    </NavLink>
                  </LinkContainer>
                  <LinkContainer to="/reports">
                    <NavLink className="d-flex align-items-center">
                      Reports
                    </NavLink>
                  </LinkContainer>
                  <NavLink
                    className="d-flex align-items-center"
                    onClick={logoutHandler}
                  >
                    <FaSignOutAlt className="me-2" size={20} />
                    Logout
                  </NavLink>
                </>
              ) : (
                <>
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
                </>
              )}
            </Nav>
          </NavbarCollapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
