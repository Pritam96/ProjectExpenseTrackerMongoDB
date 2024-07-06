import { Col, Container, Row } from "react-bootstrap";
import ReportsForm from "../components/ReportsForm";

const Reports = () => {
  return (
    <>
      <Container>
        <Row>
          <Col md={4} className="mt-4">
            <ReportsForm />
          </Col>
          <Col md={8}></Col>
        </Row>
      </Container>
    </>
  );
};

export default Reports;
