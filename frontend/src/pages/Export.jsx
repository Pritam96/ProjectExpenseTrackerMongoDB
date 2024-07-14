import {
  Button,
  Col,
  Container,
  FormSelect,
  Row,
  Spinner,
} from "react-bootstrap";
import DateRangePicker from "../components/DateRangePicker";
import { useEffect, useState } from "react";
import PaginationComponent from "../components/PaginationComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  exportExpenses,
  getExpenses,
  resetToInitialState,
  resetWithoutExpenses,
} from "../features/expense/expenseSlice";
import { toast } from "react-toastify";
import ExpenseItemLite from "../components/ExpenseItemLite";
import moment from "moment";

const Export = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [limit, setLimit] = useState("4");

  const dispatch = useDispatch();
  const { expenses, count, isError, isLoading, message, pagination } =
    useSelector((state) => state.expenses);

  useEffect(() => {
    dispatch(resetToInitialState());
    if (startDate && endDate) {
      dispatch(
        getExpenses({
          dateRange: {
            start: moment(startDate).toISOString(),
            end: moment(endDate).toISOString(),
          },
          pagination: {
            page: pagination.current || 1,
            limit: parseInt(limit, 10),
          },
        })
      );
    }

    return () => {
      dispatch(resetWithoutExpenses());
    };
  }, [startDate, endDate, dispatch, limit, pagination.current]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(resetToInitialState());
    }
  }, [isError, message, dispatch]);

  const handlePageChange = (page) => {
    dispatch(
      getExpenses({
        dateRange: {
          start: moment(startDate).toISOString(),
          end: moment(endDate).toISOString(),
        },
        pagination: {
          page: page,
          limit: parseInt(limit, 10),
        },
      })
    );
  };

  const downloadHandler = () => {
    dispatch(
      exportExpenses({
        start: moment(startDate).toISOString(),
        end: moment(endDate).toISOString(),
      })
    );
    dispatch(resetWithoutExpenses());
  };

  return (
    <Container>
      <Row>
        <Col md={5} className="mt-4">
          <Container fluid>
            <Row className="justify-content-center">
              <div className="my-2 text-center">
                <div className="h5">Choose a range</div>
                <DateRangePicker
                  onDateChange={(startDate, endDate) => {
                    setStartDate(startDate);
                    setEndDate(endDate);
                  }}
                />
              </div>
            </Row>
            {expenses.length > 0 && (
              <Row className="justify-content-center">
                <Button className="w-auto" onClick={downloadHandler}>
                  Download
                </Button>
              </Row>
            )}
          </Container>
        </Col>
        <Col md={7}>
          <Container fluid>
            <Row className="pt-3">
              <Col className="d-flex justify-content-start align-items-center">
                {" "}
                {count > 0 ? `Total ${count} records found` : null}
              </Col>
              <Col className="d-flex justify-content-end">
                <FormSelect
                  className="w-auto"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                >
                  <option value="4">4</option>
                  <option value="8">8</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
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
                    <ExpenseItemLite expense={expense} />
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
        </Col>
      </Row>
    </Container>
  );
};

export default Export;
