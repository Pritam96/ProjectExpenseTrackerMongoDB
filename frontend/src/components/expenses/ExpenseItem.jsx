import {
  Badge,
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  Col,
  Row,
} from "react-bootstrap";
import moment from "moment";
import { useDispatch } from "react-redux";
import { deleteExpense } from "../../features/expense/expenseSlice";
import { useState } from "react";

const ExpenseItem = ({ expense, expenseId, setExpenseId, showButtons }) => {
  const [editBtnClick, setEditBtnClick] = useState(false);

  const dispatch = useDispatch();

  const editHandler = () => {
    setEditBtnClick(true);
    setExpenseId(expense._id);
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
          <Col xs={showButtons ? 3 : 4} className="d-flex align-items-center">
            <CardTitle>
              <h3>₹{parseFloat(expense.amount).toFixed(2)}</h3>
            </CardTitle>
          </Col>
          <Col xs={showButtons ? 6 : 8}>
            {expense?.description && (
              <Row>
                <CardSubtitle>
                  {showButtons ? (
                    <h4>{expense.description}</h4>
                  ) : (
                    <h5>{expense.description}</h5>
                  )}
                </CardSubtitle>
              </Row>
            )}
            <Row className="d-flex justify-content-between mt-2 px-2">
              <Badge bg={categoryBadgeColor} className="mb-2">
                {expense.category}
              </Badge>
              <Badge bg={dateBadgeColor}>
                {moment(expense.date).fromNow()}
              </Badge>
            </Row>
          </Col>
          {showButtons && (
            <Col xs={3}>
              <div className="d-grid gap-2">
                <Button
                  type="button"
                  variant="info"
                  size="sm"
                  onClick={editHandler}
                  disabled={expenseId}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={deleteHandler}
                  disabled={expenseId}
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
