import { useEffect, useRef } from "react";
import {
  Button,
  Container,
  Form,
  Col,
  Card,
  CardBody,
  Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  createExpense,
  editExpense,
  cancelEdit,
} from "../../features/expense/expenseSlice";
import Input from "../UI/Input";
import CategoryList from "./category/CategoryList";

const ExpenseForm = () => {
  const expenseIdInputRef = useRef();
  const titleInputRef = useRef();
  const amountInputRef = useRef();
  const categoryInputRef = useRef();
  const descriptionInputRef = useRef();

  const dispatch = useDispatch();
  const { editData, history } = useSelector((state) => state.expenses);

  useEffect(() => {
    if (editData) {
      expenseIdInputRef.current.value = editData._id;
      titleInputRef.current.value = editData.title;
      amountInputRef.current.value = editData.amount;
      categoryInputRef.current.value = editData.categoryId;
      descriptionInputRef.current.value = editData.description || "";
    }
  }, [editData]);

  const formHandler = (e) => {
    e.preventDefault();

    const existingExpenseId = expenseIdInputRef.current.value || null;
    const enteredTitle = titleInputRef.current.value;
    const enteredAmount = amountInputRef.current.value;
    const chosenCategory = categoryInputRef.current.value;
    const enteredDescription = descriptionInputRef.current.value;

    if (!enteredTitle || !enteredAmount || !chosenCategory) return;

    if (editData) {
      dispatch(
        editExpense({
          expenseId: existingExpenseId,
          expenseData: {
            title: enteredTitle,
            amount: enteredAmount,
            category: chosenCategory,
            description: enteredDescription,
          },
        })
      );
    } else {
      const expenseData = {
        title: enteredTitle,
        amount: enteredAmount,
        category: chosenCategory,
        description: enteredDescription,
      };
      dispatch(createExpense(expenseData));
    }
    resetForm();
  };

  const resetForm = () => {
    expenseIdInputRef.current.value = "";
    titleInputRef.current.value = "";
    amountInputRef.current.value = "";
    categoryInputRef.current.value = "";
    descriptionInputRef.current.value = "";
  };

  const cancelHandler = () => {
    dispatch(cancelEdit());
    resetForm();
  };

  let historyContent =
    history && Object.keys(history).length !== 0 ? (
      <Card className="text-start items-cen">
        <CardBody className="flex-column">
          <h3>Expenses</h3>
          <Col className="mt-3">
            {history?.previousDay.total !== 0 && (
              <Row>
                <Col className="h5">Previous Day:</Col>
                <Col className="h5 text-center text-secondary">
                  ₹{history.previousDay.total}
                </Col>
              </Row>
            )}
            {history?.today.total !== 0 && (
              <Row>
                <Col className="h5 text-muted">Today:</Col>
                <Col className="h5 text-center text-danger">
                  ₹{history.today.total}
                </Col>
              </Row>
            )}
            {history?.total !== 0 && (
              <Row>
                <Col className="h5 text-muted">All-total:</Col>
                <Col className="h5 text-center">₹{history.total}</Col>
              </Row>
            )}
          </Col>
        </CardBody>
      </Card>
    ) : null;

  return (
    <Container fluid className="bg-light rounded p-3">
      {historyContent}
      <Form onSubmit={formHandler}>
        <Input id="expenseIdInput" type="hidden" ref={expenseIdInputRef} />
        <Input
          id="titleInput"
          label="Title"
          labelClasses="h5"
          placeholder="Enter title"
          ref={titleInputRef}
        />

        <Input
          id="amountInput"
          type="number"
          label="Amount"
          labelClasses="h5"
          placeholder="Enter amount"
          ref={amountInputRef}
        />

        <CategoryList ref={categoryInputRef} />

        <Input
          id="descriptionInput"
          label="Description"
          labelClasses="h5"
          placeholder="Enter description"
          ref={descriptionInputRef}
        />

        <div className="d-grid gap-2">
          <Button type="submit" variant="primary">
            Save
          </Button>

          {editData && (
            <Button type="button" variant="secondary" onClick={cancelHandler}>
              Cancel
            </Button>
          )}
        </div>
      </Form>
    </Container>
  );
};

export default ExpenseForm;
