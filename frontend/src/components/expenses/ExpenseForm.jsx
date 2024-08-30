import { useEffect, useRef, useState } from "react";
import {
  Button,
  Container,
  FormControl,
  FormGroup,
  FormLabel,
  FormSelect,
  Form,
  Col,
  Card,
  CardBody,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  createExpense,
  editExpense,
  resetWithoutExpenses,
} from "../../features/expense/expenseSlice";
import { toast } from "react-toastify";

const ExpenseForm = (props) => {
  const [chosenCategory, setChosenCategory] = useState("");

  const expenseIdInputRef = useRef();
  const titleInputRef = useRef();
  const amountInputRef = useRef();
  const descriptionInputRef = useRef();

  const dispatch = useDispatch();

  const { isEditMode, editExpenseData, isError, message, totalExpense } =
    useSelector((state) => state.expenses);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  useEffect(() => {
    if (isEditMode && editExpenseData) {
      expenseIdInputRef.current.value = editExpenseData._id;
      titleInputRef.current.value = editExpenseData.title;
      amountInputRef.current.value = editExpenseData.amount;
      descriptionInputRef.current.value = editExpenseData.description || "";

      setChosenCategory(editExpenseData.categoryId);
    }
  }, [isEditMode]);

  const formHandler = (e) => {
    e.preventDefault();

    const existingExpenseId = expenseIdInputRef.current.value || null;
    const enteredTitle = titleInputRef.current.value;
    const enteredAmount = amountInputRef.current.value;
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
      ).then(() => {
        toast.success("Expense Updated");
        dispatch(resetWithoutExpenses());
        resetForm();
      });
    } else {
      const expenseData = {
        title: enteredTitle,
        amount: enteredAmount,
        category: chosenCategory,
        description: enteredDescription,
      };
      dispatch(createExpense(expenseData)).then(() => {
        toast.success("Expense Added");
        dispatch(resetWithoutExpenses());
        resetForm();
      });
    }
  };

  const resetForm = () => {
    expenseIdInputRef.current.value = "";
    titleInputRef.current.value = "";
    amountInputRef.current.value = "";
    descriptionInputRef.current.value = "";
    setChosenCategory("");
  };

  return (
    <Container fluid>
      {totalExpense ? (
        <Card className="text-end">
          <CardBody className="flex-column">
            <Col className="m-3">
              <h3>Total Expense:</h3>
            </Col>
            <Col className="m-3">
              <h2>₹{totalExpense}</h2>
            </Col>
          </CardBody>
        </Card>
      ) : null}
      <Form onSubmit={formHandler}>
        <input type="hidden" ref={expenseIdInputRef} />
        <FormGroup className="my-3" controlId="title">
          <FormLabel className="h5">Title</FormLabel>
          <FormControl
            type="text"
            placeholder="Enter title"
            ref={titleInputRef}
          />
        </FormGroup>

        <FormGroup className="my-3" controlId="amount">
          <FormLabel className="h5">Amount</FormLabel>
          <FormControl
            type="number"
            placeholder="Enter amount"
            ref={amountInputRef}
          />
        </FormGroup>

        <FormGroup className="my-3" controlId="category">
          <FormLabel className="h5">Category</FormLabel>
          <FormSelect
            value={chosenCategory}
            onChange={(e) => setChosenCategory(e.target.value)}
          >
            <option value="" disabled>
              Select a category
            </option>
            {props.categoryList &&
              props.categoryList.map((categoryItem) => (
                <option value={categoryItem._id} key={categoryItem._id}>
                  {categoryItem.title}
                </option>
              ))}
          </FormSelect>
        </FormGroup>

        <FormGroup className="my-3" controlId="description">
          <FormLabel className="h5">Description</FormLabel>
          <FormControl
            type="text"
            placeholder="Enter description"
            ref={descriptionInputRef}
          />
        </FormGroup>

        <Button type="submit" variant="primary" className="mt-3 w-100">
          Save
        </Button>
      </Form>
    </Container>
  );
};

export default ExpenseForm;
