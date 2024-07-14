import axios from "axios";

const API_URL = "/api/report";

const getLeaderboard = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/`, config);
  return response.data;
};

const reportService = { getLeaderboard };
export default reportService;
