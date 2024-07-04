import { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  FormSelect,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "react-router-dom";
import { getCategories } from "../features/category/categorySlice";
import {
  createExpense,
  editExpense,
  reset,
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

  const { isEditMode, expense, isError, message } = useSelector(
    (state) => state.expenses
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isEditMode) {
      setExpenseId(expense._id);
      setTitle(expense.title);
      setAmount(expense.amount);
      setDescription(expense.description);
      setCategory(expense.categoryId);
    }
    dispatch(getCategories());
  }, [dispatch, isEditMode, expense, isError, message]);

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
        dispatch(reset());
        setExpenseId("");
        setTitle("");
        setAmount("");
        setDescription("");
        setCategory("");
      });
    } else {
      const expenseData = {
        title,
        amount,
        category,
        description,
      };
      dispatch(createExpense(expenseData)).then(() => {
        toast.success("Expense Created");
        dispatch(reset());
        setExpenseId("");
        setTitle("");
        setAmount("");
        setDescription("");
        setCategory("");
      });
    }
  };

  return (
    <Form onSubmit={formHandler}>
      <FormGroup className="my-2" controlId="title">
        <FormLabel>Title</FormLabel>
        <FormControl
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </FormGroup>

      <FormGroup className="my-2" controlId="amount">
        <FormLabel>Amount</FormLabel>
        <FormControl
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </FormGroup>

      <FormGroup className="my-2" controlId="category">
        <FormLabel>Category</FormLabel>
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

      <FormGroup className="my-2" controlId="description">
        <FormLabel>Description</FormLabel>
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
  );
};

export default ExpenseForm;
