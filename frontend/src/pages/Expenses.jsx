import ExpenseList from "../components/expenses/ExpenseList";
import { Col, Container, Row } from "react-bootstrap";
import ExpenseForm from "../components/expenses/ExpenseForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { resetToInitialState } from "../features/expense/expenseSlice";

const Expenses = () => {
  const [expenseId, setExpenseId] = useState(null);
  const dispatch = useDispatch();
  const { isSuccess, isError, message } = useSelector(
    (state) => state.expenses
  );

  useEffect(() => {
    if (isSuccess && message.trim()) {
      toast.success(message);
      dispatch(resetToInitialState());
    }
    if (isError) {
      toast.error(message);
      dispatch(resetToInitialState());
    }
  }, [isSuccess, isError, message, dispatch]);

  return (
    <>
      <Container>
        <Row>
          <Col md={4} className="mt-4">
            <ExpenseForm expenseId={expenseId} setExpenseId={setExpenseId} />
          </Col>
          <Col md={8}>
            <ExpenseList expenseId={expenseId} setExpenseId={setExpenseId} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Expenses;
