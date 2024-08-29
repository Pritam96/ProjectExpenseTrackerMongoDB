import { useEffect, useRef } from "react";
import FormContainer from "../components/UI/FormContainer";
import { FaUserPlus } from "react-icons/fa";
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
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, reset } from "../features/auth/authSlice";
import { toast } from "react-toastify";

const Register = () => {
  const usernameInputRef = useRef();
  const phoneInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    const enteredUsername = usernameInputRef.current.value;
    const enteredEmail = emailInputRef.current.value;
    const enteredPhone = phoneInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredConfirmPassword = confirmPasswordInputRef.current.value;

    if (enteredPassword !== enteredConfirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    dispatch(
      register({
        username: enteredUsername,
        email: enteredEmail,
        phoneNumber: enteredPhone,
        password: enteredPassword,
      })
    );
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
        <FaUserPlus className="me-2" />
        Register
      </h3>
      <Form onSubmit={submitHandler}>
        <FormGroup className="my-2" controlId="name">
          <FormLabel>Username</FormLabel>
          <FormControl
            type="text"
            placeholder="Enter username"
            ref={usernameInputRef}
          />
        </FormGroup>

        <FormGroup className="my-2" controlId="phone">
          <FormLabel>Phone No</FormLabel>
          <FormControl
            type="text"
            placeholder="Enter phone no"
            ref={phoneInputRef}
          />
        </FormGroup>

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

        <FormGroup className="my-2" controlId="confirm-password">
          <FormLabel>Confirm password</FormLabel>
          <FormControl
            type="password"
            placeholder="Confirm password"
            ref={confirmPasswordInputRef}
          />
        </FormGroup>

        <Button type="submit" variant="primary" className="mt-3">
          Register
        </Button>
      </Form>
      <Row className="py-3">
        <Col>
          Already have an account? <Link to={`/login`}>Log In</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default Register;
