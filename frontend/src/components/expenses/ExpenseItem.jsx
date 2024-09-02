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
import { useDispatch } from "react-redux";
import {
  deleteExpense,
  loadExpense,
} from "../../features/expense/expenseSlice";

const ExpenseItem = ({ expense }) => {
  const dispatch = useDispatch();

  const editHandler = () => {
    dispatch(loadExpense(expense));
  };

  const deleteHandler = () => {
    dispatch(deleteExpense(expense._id));
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
