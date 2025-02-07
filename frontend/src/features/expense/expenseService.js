import axios from "axios";

const API_URL = "/api/expense";

const addExpense = async (expenseData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.post(`${API_URL}/`, expenseData, config);
  return data;
};

const getExpenses = async ({ dateRange, pagination } = {}, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const params = new URLSearchParams();

  if (dateRange && dateRange.start && dateRange.end) {
    params.append("start", dateRange.start);
    params.append("end", dateRange.end);
  }
  if (pagination?.page) params.append("page", pagination.page);
  if (pagination?.limit) params.append("limit", pagination.limit);

  const URL = `${API_URL}/?${params.toString()}`;

  const { data } = await axios.get(URL, config);
  return data;
};

const editExpense = async (expenseId, expenseData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.put(
    `${API_URL}/${expenseId}`,
    expenseData,
    config
  );
  return data;
};

const deleteExpense = async (expenseId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.delete(`${API_URL}/${expenseId}`, config);
  return data;
};

const exportExpenses = async (dateRange, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: "blob",
  };
  const params = new URLSearchParams();
  if (dateRange) {
    params.append("start", dateRange.start);
    params.append("end", dateRange.end);
  }
  const URL = `${API_URL}/export?${params.toString()}`;
  const { data } = await axios.get(URL, config);
  return data;
};

const authService = {
  addExpense,
  getExpenses,
  editExpense,
  deleteExpense,
  exportExpenses,
};
export default authService;
