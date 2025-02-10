import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getExpenses } from "../../features/expense/expenseSlice";
import ExpenseItem from "./ExpenseItem";
import { Col, Container, FormSelect, Row, Spinner } from "react-bootstrap";
import PaginationComponent from "../UI/PaginationComponent";
import moment from "moment";

const ExpenseList = ({ expenseId, setExpenseId }) => {
  const [type, setType] = useState("all");
  const dispatch = useDispatch();
  const { expenses, count, isLoading, pagination } = useSelector(
    (state) => state.expenses
  );

  const dateRanges = useMemo(
    () => ({
      all: {
        start: undefined,
        end: undefined,
      },
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
    }),
    []
  );

  useEffect(() => {
    dispatch(
      getExpenses({
        dateRange: { start: dateRanges[type].start, end: dateRanges[type].end },
        pagination: { page: 1, limit: pagination?.limit },
      })
    );
  }, [type, dispatch, dateRanges]);

  const handlePageChange = useCallback(
    (page) => {
      dispatch(
        getExpenses({
          dateRange: {
            start: dateRanges[type].start,
            end: dateRanges[type].end,
          },
          pagination: {
            page: page || 1,
            limit: pagination?.limit,
          },
        })
      );
    },
    [dispatch, dateRanges, type, pagination?.limit]
  );

  return (
    <Container fluid>
      <Row className="flex-d pt-3">
        <Col className="d-flex justify-content-start align-items-center">
          {count > 0 ? `Total ${count} records found` : null}
        </Col>
        <Col className="d-flex justify-content-end">
          <FormSelect
            className="w-auto"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="daily">Today</option>
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="yearly">This Year</option>
          </FormSelect>
        </Col>
      </Row>
      <Row>
        {isLoading && (
          <Container className="d-flex justify-content-center align-items-center my-2">
            <Spinner animation="border" />
          </Container>
        )}
        {expenses &&
          expenses.map((expense) => (
            <div key={expense._id}>
              <ExpenseItem
                expense={expense}
                showButtons={true}
                expenseId={expenseId}
                setExpenseId={setExpenseId}
              />
            </div>
          ))}
        {!isLoading && !expenses?.length && (
          <div className="h5 mt-5 text-center">No expenses found!</div>
        )}
      </Row>
      {!isLoading && expenses.length && (
        <Row>
          <PaginationComponent
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </Row>
      )}
    </Container>
  );
};

export default ExpenseList;
