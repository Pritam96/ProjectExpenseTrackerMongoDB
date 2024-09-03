import { useEffect, useRef } from "react";
import { Button, Container, Form, Col, Card, CardBody } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  createExpense,
  editExpense,
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

  let historyContent =  
    Object.keys(history).length !== 0 ? (
      <Card className="text-start">
        <CardBody className="flex-column">
          <h2>Expenses</h2>
          {history.previousDay.total !== 0 && (
            <Col className="m-3">
              <h5>Previous day: ₹{history.previousDay.total}</h5>
            </Col>
          )}
          <Col className="m-3">
            <h5>Today: ₹{history.today.total}</h5>
          </Col>
          <Col className="m-3">
            <h5>All-Total: ₹{history.total}</h5>
          </Col>
        </CardBody>
      </Card>
    ) : null;

  return (
    <Container fluid>
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

        <Button type="submit" variant="primary" className="mt-3 w-100">
          Save
        </Button>
      </Form>
    </Container>
  );
};

export default ExpenseForm;
