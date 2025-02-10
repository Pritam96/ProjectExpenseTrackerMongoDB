import {
  Badge,
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  Col,
  Row,
  Stack,
} from "react-bootstrap";
import moment from "moment";
import { useDispatch } from "react-redux";
import { deleteExpense } from "../../features/expense/expenseSlice";
import { useState } from "react";

const ExpenseItem = ({ expense, expenseId, setExpenseId, showButtons }) => {
  const [showRelativeTime, setShowRelativeTime] = useState(true);
  const dispatch = useDispatch();

  const isEditMode = expenseId === expense._id;

  const editHandler = () => {
    setExpenseId(expense._id);
  };

  const deleteHandler = () => {
    dispatch(deleteExpense(expense._id));
  };

  const cardStyles = isEditMode ? { backgroundColor: "#e0f7fa" } : {};

  return (
    <Card className="mt-3 shadow" style={cardStyles}>
      <CardBody>
        <Row>
          <Col xs={showButtons ? 3 : 4} className="d-flex align-items-center">
            <CardTitle>
              <h3>₹{parseFloat(expense.amount).toFixed(2)}</h3>
            </CardTitle>
          </Col>
          <Col xs={showButtons ? 6 : 8} className="m-auto">
            {expense?.description && (
              <CardSubtitle>
                {showButtons ? (
                  <h4>{expense.description}</h4>
                ) : (
                  <h5>{expense.description}</h5>
                )}
              </CardSubtitle>
            )}
            <Stack direction="horizontal" gap={2} className="mt-3">
              <Badge bg={isEditMode ? "warning" : "success"}>
                {expense.category}
              </Badge>
              <Badge
                pill
                as={Button}
                bg={isEditMode ? "info" : "secondary"}
                onClick={() => setShowRelativeTime((prevState) => !prevState)}
                style={{ cursor: "pointer" }}
              >
                {showRelativeTime
                  ? moment(expense.date).fromNow()
                  : moment(expense.date).format("MMM Do YYYY, h:mm:ss a")}
              </Badge>
            </Stack>
          </Col>
          {showButtons && (
            <Col xs={3}>
              <div className="d-grid gap-2">
                <Button
                  type="button"
                  variant="info"
                  size="sm"
                  onClick={editHandler}
                  disabled={isEditMode}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={deleteHandler}
                  disabled={isEditMode}
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
