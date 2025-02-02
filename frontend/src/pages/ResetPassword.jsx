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
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { reset, resetPassword } from "../features/auth/authSlice";

const ResetPassword = () => {
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  const { token } = useParams();
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
      toast.success("Password reset successfully!");
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
    const enteredPassword = passwordInputRef.current.value;
    const enteredConfirmPassword = confirmPasswordInputRef.current.value;
    if (enteredPassword !== enteredConfirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    dispatch(resetPassword({ token, password: enteredPassword }));
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
          Submit
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ResetPassword;
