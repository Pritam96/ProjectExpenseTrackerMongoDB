import { forwardRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../../features/category/categorySlice";
import Select from "../../UI/Select";

const CategoryList = forwardRef((props, ref) => {
  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  return (
    <Select
      id="categoryInput"
      label="Category"
      placeholder="Select a category"
      ref={ref}
      defaultValue=""
      options={categories}
      valueKey="_id"
      labelKey="title"
    />
  );
});

CategoryList.displayName = "CategoryListComponent";

export default CategoryList;
