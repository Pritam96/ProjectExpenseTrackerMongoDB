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

const getExpenses = async (pagination, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  if (pagination) {
    const response = await axios.get(
      `${API_URL}/?page=${pagination.page}&limit=${pagination.limit}`,
      config
    );
    return response.data;
  }
  const response = await axios.get(`${API_URL}/`, config);
  return response.data;
};

const getExpense = async (expenseId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/${expenseId}`, config);
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

const authService = {
  create,
  getExpense,
  getExpenses,
  editExpense,
  deleteExpense,
};
export default authService;
