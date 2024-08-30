import ExpenseList from "../components/expenses/ExpenseList";
import { Col, Container, Row } from "react-bootstrap";
import ExpenseForm from "../components/expenses/ExpenseForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCategories } from "../features/category/categorySlice";

const Expenses = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  return (
    <>
      <Container>
        <Row>
          <Col md={4} className="mt-4">
            <ExpenseForm categoryList={categories} />
          </Col>
          <Col md={8}>
            <ExpenseList />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Expenses;
