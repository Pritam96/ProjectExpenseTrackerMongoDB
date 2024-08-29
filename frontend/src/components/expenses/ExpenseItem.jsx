import {
  Badge,
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Row,
} from "react-bootstrap";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  resetToInitialState,
  deleteExpense,
  loadExpense,
  resetWithoutExpenses,
} from "../../features/expense/expenseSlice";
import { useEffect } from "react";

const ExpenseItem = ({ expense }) => {
  const dispatch = useDispatch();
  const { isError, message } = useSelector((state) => state.expenses);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(resetToInitialState());
    }
  }, [isError, message, dispatch]);

  const editHandler = () => {
    dispatch(loadExpense(expense));
  };

  const deleteHandler = () => {
    dispatch(deleteExpense(expense._id)).then(() => {
      toast.success("Expense Deleted");
      dispatch(resetWithoutExpenses());
    });
  };

  return (
    <Card className="mt-3 shadow">
      <CardBody>
        <Row>
          <Col xs={3} className="d-flex align-items-center">
            <CardTitle>
              <h3>₹{expense.amount}</h3>
            </CardTitle>
          </Col>
          <Col xs={6}>
            <Row>
              <CardSubtitle>
                <h4>{expense.title}</h4>
              </CardSubtitle>
            </Row>
            {expense?.description && (
              <Row>
                <CardText>{expense.description}</CardText>
              </Row>
            )}
            <Row className="d-flex justify-content-between mt-2 px-2">
              <Badge bg="success" className="mb-2">
                {expense.category}
              </Badge>
              <Badge bg="dark">
                {moment(expense.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
              </Badge>
            </Row>
          </Col>
          <Col xs={3}>
            <div className="d-grid gap-2">
              <Button
                type="button"
                variant="info"
                size="sm"
                onClick={editHandler}
              >
                Edit
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={deleteHandler}
              >
                Delete
              </Button>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default ExpenseItem;
