import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getExpenses } from "../features/expense/expenseSlice";
import ExpenseItem from "./ExpenseItem";
import { Col, Container, FormSelect, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import PaginationComponent from "./PaginationComponent";

const ExpenseList = () => {
  const [type, setType] = useState("daily");

  const dispatch = useDispatch();
  const { expenses, isError, isLoading, message, pagination } = useSelector(
    (state) => state.expenses
  );

  useEffect(() => {
    dispatch(getExpenses({ type }));
    if (isError) {
      toast.error(message);
    }
  }, [dispatch, message, isError, type]);

  const { totalExpenses } = useSelector((state) => state.expenses);

  const handlePageChange = (page) => {
    dispatch(
      getExpenses({
        type,
        pagination: {
          page: page,
          limit: pagination.limit,
        },
      })
    );
  };

  return (
    <Container fluid>
      <Row className="flex-d pt-3">
        <Col className="d-flex">
          <div className="mt-3">
            Total ({type}) : <b>₹{totalExpenses[type]}</b>
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
        {isLoading ? (
          <Container className="d-flex justify-content-center align-items-center mt-5">
            <Spinner animation="border" />
          </Container>
        ) : expenses.length > 0 ? (
          expenses.map((expense) => (
            <div key={expense._id}>
              <ExpenseItem expense={expense} />
            </div>
          ))
        ) : (
          <div className="h5 mt-5 text-center">No expenses found!</div>
        )}
      </Row>
      <Row>
        <PaginationComponent
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </Row>
    </Container>
  );
};

export default ExpenseList;
