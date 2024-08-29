import ExpenseList from "../components/expenses/ExpenseList";
import { Col, Container, Row } from "react-bootstrap";
import ExpenseForm from "../components/expenses/ExpenseForm";

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
