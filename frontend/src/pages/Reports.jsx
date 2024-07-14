import { useEffect } from "react";
import {
  Card,
  CardBody,
  CardText,
  Col,
  Container,
  Row,
  Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getLeaderboard } from "../features/reports/reportSlice";
import { toast } from "react-toastify";

const Reports = () => {
  const dispatch = useDispatch();
  const { data, isError, isLoading, message } = useSelector(
    (state) => state.reports
  );

  useEffect(() => {
    dispatch(getLeaderboard());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  return (
    <>
      <Container>
        <Row>
          <Col md={4} className="mt-4">
            <h3>Leader-Board</h3>
          </Col>
          <Col md={8}>
            <Row>
              {isLoading ? (
                <Container className="d-flex justify-content-center align-items-center mt-5">
                  <Spinner animation="border" />
                </Container>
              ) : data.length > 0 ? (
                data.map((item) => (
                  <div key={item._id}>
                    <Card className="mt-3 shadow">
                      <CardBody>
                        <Row className="flex-row align-items-center justify-content-between">
                          <Col md={3} sm={3} xs={3}>
                            <CardText className="h3 text-center">
                              {item.position}
                            </CardText>
                          </Col>
                          <Col md={6} sm={6} xs={6}>
                            <Row>
                              <CardText className="h5">
                                {item.username}
                              </CardText>
                            </Row>
                            <Row>
                              <CardText className="text-muted">
                                {item.email}
                              </CardText>
                            </Row>
                            <Row>
                              <CardText className="h5 text-muted">
                                {item.phoneNumber}
                              </CardText>
                            </Row>
                          </Col>
                          <Col md={3} sm={3} xs={3}>
                            <CardText className="h2">
                              ₹{item.totalAmount}
                            </CardText>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </div>
                ))
              ) : (
                <div className="h5 mt-5 text-center">No expenses found!</div>
              )}
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Reports;
