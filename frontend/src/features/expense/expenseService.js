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
  const response = await axios.get(URL, config);
  return response.data;
};

const authService = {
  create,
  getExpenses,
  editExpense,
  deleteExpense,
  exportExpenses,
};
export default authService;
