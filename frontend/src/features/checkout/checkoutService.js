import axios from "axios";

const API_URL = "/api/payment";

const create = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${API_URL}/create`, {}, config);
  return response.data;
};

const verify = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(
    `${API_URL}/verify`,
    {
      razorpay_payment_id: data.razorpay_payment_id,
      razorpay_order_id: data.razorpay_order_id,
      razorpay_signature: data.razorpay_signature,
    },
    config
  );
  return response.data;
};

const checkoutService = {
  create,
  verify,
};

export default checkoutService;
