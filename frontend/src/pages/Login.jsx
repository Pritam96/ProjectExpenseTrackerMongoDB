import {
  Button,
  Col,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
} from "react-bootstrap";
import { FaSignInAlt } from "react-icons/fa";
import FormContainer from "../components/FormContainer";
import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(email, password);
  };

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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormGroup>

        <FormGroup className="my-2" controlId="password">
          <FormLabel>Password</FormLabel>
          <FormControl
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormGroup>

        <Button type="submit" variant="primary" className="mt-3">
          Log In
        </Button>
      </Form>
      <Row className="py-3">
        <Col md={12}>
          New Customer? <Link to={`/register`}>Register</Link>
        </Col>
        <Col md={12} className="mt-3">
          Forgot Password? <Link to={`/reset`}>Reset Password</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default Login;
