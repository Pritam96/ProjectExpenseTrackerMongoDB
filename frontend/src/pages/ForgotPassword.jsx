import {
  Button,
  Container,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Spinner,
} from "react-bootstrap";
import FormContainer from "../components/UI/FormContainer";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { forgotPassword, reset } from "../features/auth/authSlice";

const ForgotPassword = () => {
  const emailInputRef = useRef();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (user) {
      navigate("/");
    }
    if (isSuccess) {
      toast.success("Email sent successfully!");
      navigate("/login");
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
    dispatch(forgotPassword(enteredEmail));
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
      <h3 className="d-flex align-items-center">Forgot Password</h3>
      <Form onSubmit={submitHandler} autoComplete="off">
        <FormGroup className="my-2" controlId="email">
          <FormLabel>Email Address</FormLabel>
          <FormControl
            type="email"
            placeholder="Enter email"
            ref={emailInputRef}
          />
        </FormGroup>

        <Button type="submit" variant="primary" className="mt-3">
          Submit
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ForgotPassword;
