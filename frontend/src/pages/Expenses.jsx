import ExpenseList from "../components/ExpenseList";
import { Col, Container, Row } from "react-bootstrap";
import ExpenseForm from "../components/ExpenseForm";

const Expenses = () => {
  return (
    <>
      <Container>
        <Row>
          <Col md={4} className="mt-4">
            <ExpenseForm />
          </Col>
          <Col md={8}>
            <ExpenseList />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Expenses;
