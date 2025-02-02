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
} from "../../features/expense/expenseSlice";
import Input from "../UI/Input";
import CategoryList from "./category/CategoryList";
import moment from "moment";

const ExpenseForm = ({ expenseId, setExpenseId }) => {
  const amountInputRef = useRef(null);
  const categoryInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const dateInputRef = useRef(null);

  const dispatch = useDispatch();

  const { history, isLoading } = useSelector((state) => state.expenses);

  const expenseData = useSelector(
    (state) =>
      expenseId && state.expenses.expenses.find((e) => e._id === expenseId)
  );

  useEffect(() => {
    if (expenseId) {
      if (amountInputRef.current)
        amountInputRef.current.value = expenseData.amount.toFixed(2);
      if (categoryInputRef.current)
        categoryInputRef.current.value = expenseData.categoryId;
      if (descriptionInputRef.current)
        descriptionInputRef.current.value = expenseData.description || "";
      if (dateInputRef.current)
        dateInputRef.current.value = moment(expenseData.date).format(
          "YYYY-MM-DDTHH:mm"
        );
    } else {
      resetForm();
    }
  }, [expenseData]);

  const formHandler = (e) => {
    e.preventDefault();
    const enteredAmount = parseFloat(amountInputRef.current?.value);
    const chosenCategory = categoryInputRef.current?.value;
    const enteredDescription = descriptionInputRef.current?.value;
    const chosenDateTime = dateInputRef.current?.value || null;

    if (isNaN(enteredAmount) || !chosenCategory) return;

    const data = {
      amount: parseFloat(enteredAmount.toFixed(2)),
      category: chosenCategory,
      description: enteredDescription,
      date: moment(chosenDateTime).toISOString(),
    };

    if (expenseId) {
      dispatch(
        editExpense({
          expenseId,
          expenseData: data,
        })
      );
    } else {
      dispatch(createExpense(data));
    }
    resetForm();
  };

  const resetForm = () => {
    setExpenseId(null);
    if (amountInputRef.current) amountInputRef.current.value = "";
    if (categoryInputRef.current) categoryInputRef.current.value = "";
    if (descriptionInputRef.current) descriptionInputRef.current.value = "";
    if (dateInputRef.current) dateInputRef.current.value = "";
  };

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  const previousDate = new Date(currentDate);
  previousDate.setDate(currentDate.getDate() - 1);
  const previousYear = previousDate.getFullYear();
  const previousMonth = previousDate.getMonth() + 1;
  const previousDay = previousDate.getDate();

  const total = parseFloat(history?.total || 0).toFixed(2);
  let today = "0.00";
  let previous = "0.00";

  if (history?.daily?.length > 0) {
    const latestEntry = history.daily[history.daily.length - 1];
    if (
      latestEntry.day === currentDay &&
      latestEntry.month === currentMonth &&
      latestEntry.year === currentYear
    ) {
      today = parseFloat(latestEntry.total || 0).toFixed(2);
    }

    if (history.daily.length > 1) {
      const previousEntry = history.daily[history.daily.length - 2];
      if (
        previousEntry.day === previousDay &&
        previousEntry.month === previousMonth &&
        previousEntry.year === previousYear
      ) {
        previous = parseFloat(previousEntry.total || 0).toFixed(2);
      }
    } else if (
      latestEntry.day === previousDay &&
      latestEntry.month === previousMonth &&
      latestEntry.year === previousYear
    ) {
      previous = parseFloat(latestEntry.total || 0).toFixed(2);
    }
  }

  const historyContent = history && Object.keys(history).length !== 0 && (
    <Card className="text-start">
      <CardBody className="flex-column">
        <h3>Expenses</h3>
        <Col className="mt-3">
          <Row>
            <Col className="h5 text-muted">Previous:</Col>
            <Col className="h5 text-center text-muted">₹{previous}</Col>
          </Row>

          <Row>
            <Col className="h5 text-muted">Today:</Col>
            <Col className="h5 text-center text-danger">₹{today}</Col>
          </Row>

          <Row>
            <Col className="h5 text-muted">Total:</Col>
            <Col className="h5 text-center">₹{total}</Col>
          </Row>
        </Col>
      </CardBody>
    </Card>
  );

  return (
    <Container fluid className="bg-light rounded p-3">
      {!isLoading && historyContent}
      <Form onSubmit={formHandler} autoComplete="off">
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

        <Input
          id="dateTimeInput"
          label="Date"
          type="datetime-local"
          labelClasses="h5"
          placeholder="Choose date"
          ref={dateInputRef}
        />

        <div className="d-grid gap-2">
          <Button type="submit" variant="primary">
            Save
          </Button>

          {expenseData && (
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </Form>
    </Container>
  );
};

export default ExpenseForm;
