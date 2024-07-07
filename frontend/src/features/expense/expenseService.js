import axios from "axios";

const API_URL = "/api/expense";

const create = async (expenseData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${API_URL}/`, expenseData, config);
  return response.data;
};

const getExpenses = async ({ type, pagination } = {}, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const params = new URLSearchParams();

  if (type) params.append("type", type);
  if (pagination?.page) params.append("page", pagination.page);
  if (pagination?.limit) params.append("limit", pagination.limit);

  const URL = `${API_URL}/?${params.toString()}`;

  console.log(URL);

  const response = await axios.get(URL, config);
  return response.data;
};

const editExpense = async (expenseId, expenseData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(
    `${API_URL}/${expenseId}`,
    expenseData,
    config
  );
  return response.data;
};

const deleteExpense = async (expenseId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(`${API_URL}/${expenseId}`, config);
  return response.data;
};

const getTotalExpenses = async ({ year, month, week } = {}, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const params = new URLSearchParams();

  if (year) params.append("year", year);
  if (month) params.append("month", month);
  if (week) params.append("week", week);

  const URL = `${API_URL}/summary?${params.toString()}`;

  const response = await axios.get(URL, config);
  return response.data;
};

const authService = {
  create,
  getExpenses,
  editExpense,
  deleteExpense,
  getTotalExpenses,
};
export default authService;
