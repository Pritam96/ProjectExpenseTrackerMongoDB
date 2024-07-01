import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
} from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useState } from "react";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const submitHandler = (e) => {
    e.preventDefault();
    console.log(email);
  };
  return (
    <FormContainer>
      <h3 className="d-flex align-items-center">Forgot Password</h3>
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

        <Button type="submit" variant="primary" className="mt-3">
          Submit
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ResetPassword;
