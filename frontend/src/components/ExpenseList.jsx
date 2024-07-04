import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getExpenses } from "../features/expense/expenseSlice";
import ExpenseItem from "./ExpenseItem";
import { Container, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

const ExpenseList = () => {
  const dispatch = useDispatch();
  const { expenses, isError, isLoading, message } = useSelector(
    (state) => state.expenses
  );

  useEffect(() => {
    dispatch(getExpenses());
    if (isError) {
      toast.error(message);
    }
  }, [dispatch, message, isError]);

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return expenses ? (
    <Container fluid>
      {expenses.map((expense) => (
        <div key={expense._id}>
          <ExpenseItem expense={expense} />
        </div>
      ))}
    </Container>
  ) : (
    <div>No expenses found</div>
  );
};

export default ExpenseList;
