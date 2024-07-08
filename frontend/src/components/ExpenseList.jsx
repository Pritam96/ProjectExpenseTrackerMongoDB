import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getExpenses } from "../features/expense/expenseSlice";
import ExpenseItem from "./ExpenseItem";
import { Col, Container, FormSelect, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import PaginationComponent from "./PaginationComponent";
import moment from "moment";

const dateRanges = {
  daily: {
    start: moment(Date.now()).startOf("day").toISOString(),
    end: moment(Date.now()).endOf("day").toISOString(),
  },
  weekly: {
    start: moment(Date.now()).startOf("week").toISOString(),
    end: moment(Date.now()).endOf("week").toISOString(),
  },
  monthly: {
    start: moment(Date.now()).startOf("month").toISOString(),
    end: moment(Date.now()).endOf("month").toISOString(),
  },
  yearly: {
    start: moment(Date.now()).startOf("year").toISOString(),
    end: moment(Date.now()).endOf("year").toISOString(),
  },
};

const ExpenseList = () => {
  const [type, setType] = useState("daily");

  const dispatch = useDispatch();
  const { expenses, isError, isLoading, message, pagination } = useSelector(
    (state) => state.expenses
  );

  useEffect(() => {
    dispatch(
      getExpenses({
        dateRange: { start: dateRanges[type].start, end: dateRanges[type].end },
      })
    );
    if (isError) {
      toast.error(message);
    }
  }, [dispatch, message, isError, type]);

  const handlePageChange = (page) => {
    dispatch(
      getExpenses({
        dateRange: { start: dateRanges[type].start, end: dateRanges[type].end },
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
          {/* <div className="mt-3">Total Expenses: </div> */}
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
