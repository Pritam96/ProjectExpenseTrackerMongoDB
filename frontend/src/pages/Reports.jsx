import { Col, Container, Row } from "react-bootstrap";
import DateRangePicker from "../components/DateRangePicker";
import { useEffect, useState } from "react";
import moment from "moment";

const Reports = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (startDate && endDate) {
      console.log("startDate", moment(startDate).format("YYYY-MM-DD"));
      console.log("endDate", moment(endDate).format("YYYY-MM-DD"));
    }
  }, [startDate, endDate]);

  return (
    <>
      <Container>
        <Row>
          <Col md={4} className="mt-4">
            <div className="my-2">
              <div>Choose a range</div>
              <DateRangePicker
                onDateChange={(startDate, endDate) => {
                  setStartDate(startDate);
                  setEndDate(endDate);
                }}
              />
            </div>
          </Col>
          <Col md={8}></Col>
        </Row>
      </Container>
    </>
  );
};

export default Reports;
