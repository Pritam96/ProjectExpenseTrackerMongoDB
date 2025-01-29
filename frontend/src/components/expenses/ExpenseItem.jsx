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
import {
  deleteExpense,
  loadExpense,
} from "../../features/expense/expenseSlice";
import { useEffect, useState } from "react";

const ExpenseItem = ({ expense }) => {
  const [editBtnClick, setEditBtnClick] = useState(false);
  const { editData } = useSelector((state) => state.expenses);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!editData) {
      setEditBtnClick(false);
    }
  }, [editData]);

  const editHandler = () => {
    setEditBtnClick(true);
    dispatch(loadExpense(expense));
  };

  const deleteHandler = () => {
    dispatch(deleteExpense(expense._id));
  };

  const cardStyles = editBtnClick ? { backgroundColor: "#e0f7fa" } : {};

  const categoryBadgeColor = editBtnClick ? "warning" : "success";
  const dateBadgeColor = editBtnClick ? "info" : "secondary";

  return (
    <Card className="mt-3 shadow" style={cardStyles}>
      <CardBody>
        <Row>
          <Col xs={3} className="d-flex align-items-center">
            <CardTitle>
              <h3>₹{parseFloat(expense.amount).toFixed(2)}</h3>
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
              <Badge bg={categoryBadgeColor} className="mb-2">
                {expense.category}
              </Badge>
              <Badge bg={dateBadgeColor}>
                {moment(expense.createdAt).fromNow()}
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
                disabled={editData}
              >
                Edit
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={deleteHandler}
                disabled={editData}
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
