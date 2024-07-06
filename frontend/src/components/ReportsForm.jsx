import { useEffect, useState } from "react";
import moment from "moment";
import { FormControl, FormGroup, FormLabel } from "react-bootstrap";
import { Form } from "react-router-dom";

const ReportsForm = () => {
  const [startDate, setStartDate] = useState(moment().isoWeekday(1).format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().isoWeekday(7).format("YYYY-MM-DD"));

  const [selectedWeek, setSelectedWeek] = useState("");

  useEffect(() => {
    if (selectedWeek) {
      const [year, week] = selectedWeek.split("-W");
      const startOfWeek = moment().isoWeekday(1).year(year).week(week);
      setStartDate(startOfWeek.format("YYYY-MM-DD"));
      setEndDate(startOfWeek.add(1, "week").subtract(1, "day").format("YYYY-MM-DD"));
    }
  }, [selectedWeek]);

  return (
    <Form>
      <FormGroup className="my-2" controlId="week">
        <FormLabel>Choose a Week</FormLabel>
        <FormControl
          type="week"
          placeholder="Enter description"
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(e.target.value)}
        />
      </FormGroup>
    </Form>
  );
};

export default ReportsForm;
