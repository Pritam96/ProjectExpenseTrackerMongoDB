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
  resetWithoutExpenses,
} from "../features/expense/expenseSlice";
import { useEffect, useState } from "react";

const ExpenseItem = ({ expense }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const dispatch = useDispatch();
  const { isError, message } = useSelector((state) => state.expenses);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(resetToInitialState());
    }
  }, [isError, message, dispatch]);

  const deleteHandler = () => {
    dispatch(deleteExpense(expense._id)).then(() => {
      toast.success("Expense Deleted");
      dispatch(resetWithoutExpenses());
    });
  };

  const cardClickHandler = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Card className="mt-3 shadow" onClick={cardClickHandler}>
      <CardBody>
        <Row>
          <Col xs={isCollapsed ? 4 : 3} className="d-flex align-items-center">
            <CardTitle className="mb-0">
              <h3>₹{expense.amount}</h3>
            </CardTitle>
          </Col>
          <Col xs={isCollapsed ? 8 : 6}>
            <Row>
              <CardSubtitle>
                {isCollapsed ? (
                  <h5>{expense.title}</h5>
                ) : (
                  <h4>{expense.title}</h4>
                )}
              </CardSubtitle>
            </Row>
            {!isCollapsed && expense?.description && (
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
          {!isCollapsed && (
            <Col xs={3}>
              <div className="d-grid gap-2">
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
          )}
        </Row>
      </CardBody>
    </Card>
  );
};

export default ExpenseItem;
