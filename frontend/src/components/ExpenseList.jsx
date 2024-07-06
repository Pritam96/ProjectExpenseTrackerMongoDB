import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getExpenses } from "../features/expense/expenseSlice";
import ExpenseItem from "./ExpenseItem";
import { Col, Container, FormSelect, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

const ExpenseList = () => {
  const [type, setType] = useState("daily");

  const dispatch = useDispatch();
  const { expenses, isError, isLoading, message } = useSelector(
    (state) => state.expenses
  );

  useEffect(() => {
    dispatch(getExpenses(type));
    if (isError) {
      toast.error(message);
    }
  }, [dispatch, message, isError, type]);

  const { totalExpenses } = useSelector((state) => state.expenses);

  return (
    <Container fluid>
      <Row className="flex-d">
        <Col className="d-flex">
          <div className="mt-3 text-underline">
            Total Expenses ({type}) : <b>₹{totalExpenses[type]}</b>
          </div>
        </Col>
        <Col className="d-flex justify-content-end">
          <FormSelect
            className="w-auto"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="daily">Today</option>
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="yearly">This Year</option>
          </FormSelect>
        </Col>
      </Row>
      <Row>
        {expenses && expenses.length > 0 ? (
          expenses.map((expense) => (
            <div key={expense._id}>
              <ExpenseItem expense={expense} />
            </div>
          ))
        ) : (
          <div className="h5 mt-5 text-center">No expenses found!</div>
        )}

        {isLoading && (
          <Container className="d-flex justify-content-center align-items-center mt-5">
            <Spinner animation="border" />
          </Container>
        )}
      </Row>
    </Container>
  );
};

export default ExpenseList;
