import { Card, Container } from "react-bootstrap";

const Home = () => {
  return (
    <div className="py-5">
      <Container className="d-flex justify-content-center">
        <Card className="p-5 d-flex flex-column align-items-center hero-card bg-light w-75">
          <h1 className="text-center mb-4">ExpenseTracker</h1>
          <p className="text-center mb-4">
            ExpenseTracker helps you manage your finances with ease. Track daily
            expenses, budget monthly bills, and save for future goals.
          </p>
          <p className="text-center mb-4">
            Built with the MERN stack, it offers a seamless, secure experience
            with JWT authentication and Redux Toolkit for state management.
            Enjoy a stylish, responsive interface powered by React Bootstrap.
          </p>
        </Card>
      </Container>
    </div>
  );
};

export default Home;
