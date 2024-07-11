import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getExpenses,
  resetToInitialState,
  resetWithoutExpenses,
} from "../features/expense/expenseSlice";
import ExpenseItem from "./ExpenseItem";
import { Col, Container, FormSelect, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import PaginationComponent from "./PaginationComponent";
import moment from "moment";

const dateRanges = {
  daily: {
    start: moment().startOf("day").toISOString(),
    end: moment().endOf("day").toISOString(),
  },
  weekly: {
    start: moment().startOf("week").toISOString(),
    end: moment().endOf("week").toISOString(),
  },
  monthly: {
    start: moment().startOf("month").toISOString(),
    end: moment().endOf("month").toISOString(),
  },
  yearly: {
    start: moment().startOf("year").toISOString(),
    end: moment().endOf("year").toISOString(),
  },
};

const ExpenseList = () => {
  const [type, setType] = useState("daily");

  const dispatch = useDispatch();
  const { expenses, count, isError, isLoading, message, pagination } =
    useSelector((state) => state.expenses);

  useEffect(() => {
    dispatch(resetToInitialState());
    fetchExpenses();
    return () => {
      dispatch(resetWithoutExpenses());
    };
  }, [type]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(resetToInitialState());
    }
  }, [isError, message, dispatch]);

  const fetchExpenses = () => {
    dispatch(
      getExpenses({
        dateRange: { start: dateRanges[type].start, end: dateRanges[type].end },
        pagination: { page: 1, limit: pagination?.next?.limit || 4 },
      })
    ).finally(() => {
      dispatch(resetWithoutExpenses());
    });
  };

  const handlePageChange = (page) => {
    dispatch(
      getExpenses({
        dateRange: { start: dateRanges[type].start, end: dateRanges[type].end },
        pagination: {
          page: page,
          limit: pagination?.next?.limit || 4,
        },
      })
    ).finally(() => {
      dispatch(resetWithoutExpenses());
    });
  };

  return (
    <Container fluid>
      <Row className="flex-d pt-3">
        <Col className="d-flex justify-content-start align-items-center">
          {" "}
          {count > 0 ? `Total ${count} records found` : null}
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
