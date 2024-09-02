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
  const { isEditMode, editExpenseData, totalExpenses } = useSelector(
    (state) => state.expenses
  );

  useEffect(() => {
    if (isEditMode) {
      expenseIdInputRef.current.value = editExpenseData._id;
      titleInputRef.current.value = editExpenseData.title;
      amountInputRef.current.value = editExpenseData.amount;
      categoryInputRef.current.value = editExpenseData.categoryId;
      descriptionInputRef.current.value = editExpenseData.description || "";
    }
  }, [isEditMode, editExpenseData]);

  const formHandler = (e) => {
    e.preventDefault();

    const existingExpenseId = expenseIdInputRef.current.value || null;
    const enteredTitle = titleInputRef.current.value;
    const enteredAmount = amountInputRef.current.value;
    const chosenCategory = categoryInputRef.current.value;
    const enteredDescription = descriptionInputRef.current.value;

    if (isEditMode) {
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

  return (
    <Container fluid>
      {totalExpenses ? (
        <Card className="text-end">
          <CardBody className="flex-column">
            <Col className="m-3">
              <h3>Total Expenses:</h3>
            </Col>
            <Col className="m-3">
              <h2>₹{totalExpenses}</h2>
            </Col>
          </CardBody>
        </Card>
      ) : null}
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
