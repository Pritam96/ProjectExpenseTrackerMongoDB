import { forwardRef } from "react";
import { FormGroup, FormLabel, FormSelect } from "react-bootstrap";

const Select = forwardRef((props, ref) => {
  const {
    options = [],
    valueKey = "", // Key for option values
    labelKey = "", // Key for option labels
    id,
    label,
    defaultValue = "",
    placeholder,
    ...rest
  } = props;

  return (
    <FormGroup className="my-3" controlId={id}>
      {label && <FormLabel className="h5">{label}</FormLabel>}

      <FormSelect ref={ref} defaultValue={defaultValue} {...rest}>
        {placeholder && (
          <option value={defaultValue} disabled>
            {placeholder}
          </option>
        )}
        {options?.map((item) => (
          <option value={item[valueKey]} key={item[valueKey]}>
            {item[labelKey]}
          </option>
        ))}
      </FormSelect>
    </FormGroup>
  );
});

Select.displayName = "SelectComponent";

export default Select;
