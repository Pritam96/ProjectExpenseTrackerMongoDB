import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
  Spinner,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { FaSignInAlt } from "react-icons/fa";
import FormContainer from "../components/UI/FormContainer";
import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../features/auth/authSlice";

const Login = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess || user) {
      navigate("/");
    }
    return () => {
      if (isSuccess || isError) {
        dispatch(reset());
      }
    };
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    dispatch(login({ email: enteredEmail, password: enteredPassword }));
  };

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <FormContainer>
      <h3 className="d-flex align-items-center">
        <FaSignInAlt className="me-2" />
        Log In
      </h3>
      <Form onSubmit={submitHandler}>
        <FormGroup className="my-2" controlId="email">
          <FormLabel>Email Address</FormLabel>
          <FormControl
            type="email"
            placeholder="Enter email"
            ref={emailInputRef}
          />
        </FormGroup>

        <FormGroup className="my-2" controlId="password">
          <FormLabel>Password</FormLabel>
          <FormControl
            type="password"
            placeholder="Enter password"
            ref={passwordInputRef}
          />
        </FormGroup>

        <Button
          type="submit"
          variant="primary"
          className={`mt-3 ${isLoading ? "disabled" : ""}`}
        >
          Log In
        </Button>
      </Form>
      <Row className="py-3">
        <Col md={12}>
          New Customer? <Link to={`/register`}>Register</Link>
        </Col>
        <Col md={12} className="mt-3">
          Forgot Password? <Link to={`/forgot`}>Reset Password</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default Login;
