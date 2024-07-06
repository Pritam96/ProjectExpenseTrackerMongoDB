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

const getExpenses = async (type, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/?type=${type}`, config);
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

const getTotalExpenses = async (start, end, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  if (start && end) {
    const response = await axios.get(
      `${API_URL}/total?start=${start}&end=${end}`,
      config
    );
    return response.data;
  }
  const response = await axios.get(`${API_URL}/total`, config);
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
