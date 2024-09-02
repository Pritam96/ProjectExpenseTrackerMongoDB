import { forwardRef } from "react";
import { FormControl, FormGroup, FormLabel } from "react-bootstrap";

const Input = forwardRef((props, ref) => {
  const {
    type = "text",
    id,
    label,
    labelClasses = "",
    placeholder,
    ...rest
  } = props;

  if (type === "hidden") {
    return <input type={type} id={id} ref={ref} {...rest} />;
  }

  return (
    <FormGroup className="my-3" controlId={id}>
      {label && <FormLabel className={labelClasses}>{label}</FormLabel>}
      <FormControl type={type} placeholder={placeholder} ref={ref} {...rest} />
    </FormGroup>
  );
});

Input.displayName = "InputComponent";

export default Input;
