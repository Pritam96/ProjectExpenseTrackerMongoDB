import ExpenseList from "../components/ExpenseList";
import { Col, Container, Row } from "react-bootstrap";
import ExpenseForm from "../components/ExpenseForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getTotalExpenses } from "../features/expense/expenseSlice";

const Expenses = () => {
  const dispatch = useDispatch();
  const { expenses } = useSelector((state) => state.expenses);
  useEffect(() => {
    dispatch(getTotalExpenses({}));
  }, [expenses, dispatch]);

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
