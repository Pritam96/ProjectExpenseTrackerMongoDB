import { Pagination } from "react-bootstrap";

const PaginationComponent = ({ pagination, onPageChange }) => {
  if (pagination.totalPages === 1) return null;

  const clickHandler = (page) => {
    if (page === pagination.currentPage) return;
    onPageChange(page);
  };

  let active = pagination.currentPage;
  let items = [];
  for (let number = 1; number <= pagination.totalPages; number++) {
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
