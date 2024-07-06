import { Pagination } from "react-bootstrap";

const PaginationComponent = ({ pagination, onPageChange }) => {
  const clickHandler = (page) => {
    onPageChange(page);
  };

  let active = pagination.current;
  let items = [];
  for (let number = 1; number <= pagination.total; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === active}
        onClick={() => clickHandler(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <Pagination className="mt-4 d-flex justify-content-center">
      {items}
    </Pagination>
  );
};

export default PaginationComponent;
