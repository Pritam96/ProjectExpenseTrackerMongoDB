import { useEffect, useState } from "react";
import {
  Button,
  Container,
  FormControl,
  FormGroup,
  FormLabel,
  FormSelect,
  Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../features/category/categorySlice";
import {
  createExpense,
  editExpense,
  resetWithoutExpenses,
} from "../features/expense/expenseSlice";
import { toast } from "react-toastify";

const ExpenseForm = () => {
  const [expenseId, setExpenseId] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.categories);

  const { isEditMode, editExpenseData, isError, message } = useSelector(
    (state) => state.expenses
  );

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  useEffect(() => {
    if (isEditMode && editExpenseData) {
      setExpenseId(editExpenseData._id);
      setTitle(editExpenseData.title);
      setAmount(editExpenseData.amount);
      setDescription(editExpenseData.description || "");
      setCategory(editExpenseData.categoryId);
    }
  }, [isEditMode]);

  const formHandler = (e) => {
    e.preventDefault();
    if (isEditMode) {
      dispatch(
        editExpense({
          expenseId: expenseId,
          expenseData: {
            title,
            amount,
            category,
            description,
          },
        })
      ).then(() => {
        toast.success("Expense Updated");
        dispatch(resetWithoutExpenses());
        resetForm();
      });
    } else {
      const expenseData = {
        title,
        amount,
        category,
        description,
      };
      dispatch(createExpense(expenseData)).then(() => {
        toast.success("Expense Added");
        dispatch(resetWithoutExpenses());
        resetForm();
      });
    }
  };

  const resetForm = () => {
    setExpenseId("");
    setTitle("");
    setAmount("");
    setDescription("");
    setCategory("");
  };

  return (
    <Container fluid>
      <Form onSubmit={formHandler}>
        <FormGroup className="my-3" controlId="title">
          <FormLabel className="h5">Title</FormLabel>
          <FormControl
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormGroup>

        <FormGroup className="my-3" controlId="amount">
          <FormLabel className="h5">Amount</FormLabel>
          <FormControl
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </FormGroup>

        <FormGroup className="my-3" controlId="category">
          <FormLabel className="h5">Category</FormLabel>
          <FormSelect
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories &&
              categories.map((categoryItem) => (
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
