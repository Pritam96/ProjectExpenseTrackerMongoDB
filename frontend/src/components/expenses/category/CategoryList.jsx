import { forwardRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../../features/category/categorySlice";
import Select from "../../UI/Select";

const CategoryList = forwardRef((props, ref) => {
  const dispatch = useDispatch();

  const { categories, isLoading } = useSelector((state) => state.categories);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(getCategories());
    }
  }, [categories, dispatch]);

  // Category list always remain same
  // Memoize categories to avoid unnecessary recalculations
  const memoizedCategories = useMemo(() => {
    return categories || [];
  }, [categories]);

  return (
    <Select
      id="categoryInput"
      label="Category"
      placeholder="Select a category"
      ref={ref}
      defaultValue=""
      options={memoizedCategories}
      valueKey="_id"
      labelKey="title"
      disabled={isLoading}
    />
  );
});

CategoryList.displayName = "CategoryListComponent";

export default CategoryList;
