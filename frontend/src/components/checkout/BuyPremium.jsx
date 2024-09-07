import { Button, Card, CardBody, CardFooter, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  createOrder,
  reset,
  verifySignature,
} from "../../features/checkout/checkoutSlice";
import { useEffect, useState } from "react";
import { setPremium } from "../../features/auth/authSlice";

const BuyPremium = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderDetails, isSuccess, isError, message } = useSelector(
    (state) => state.checkout
  );
  const [isPaymentInitialized, setIsPaymentInitialized] = useState(false);

  useEffect(() => {
    setIsPaymentInitialized(false);
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess && orderDetails && !isPaymentInitialized) {
      initializePayment();
      setIsPaymentInitialized(true);
    }
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isSuccess, isError, orderDetails, message]);

  const initializePayment = () => {
    const secret_key = import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!orderDetails || !user || !secret_key) {
      console.error("Order details or user details are missing");
      return;
    }

    const options = {
      key: secret_key,
      amount: orderDetails.amount,
      name: "Acme Corp",
      description: "Test Transaction",
      image: "https://avatars.githubusercontent.com/u/48077267?v=4",
      order_id: orderDetails.id,
      handler: async (response) => {
        try {
          const responseData = await response;
          toast.success("Payment successful.");
          dispatch(verifySignature({ ...responseData }));

          dispatch(setPremium());
          toast.success("User upgraded to premium successfully.");

          navigate("/reports");
        } catch (error) {
          console.error("Error verifying payment signature:", error);
          toast.error(
            "An error occurred during the payment verification process. Please try again."
          );
        }
      },
      prefill: {
        name: orderDetails.name,
        email: orderDetails.email,
        contact: orderDetails.contact,
      },
      notes: {
        address: "Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();

    razor.on("payment.failed", function (response) {
      console.error("Payment failed:", response.error);
      alert("Payment failed. Please try again.");
    });
  };

  const checkoutHandler = async () => {
    try {
      dispatch(createOrder());
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error(
        "An error occurred while creating the order. Please try again."
      );
    }
  };

  return (
    <Container className="d-flex justify-content-center">
      <Card className="d-flex flex-column mt-5 bg-light w-75 shadow">
        <CardBody>
          You need a premium account to access this page. Please upgrade to
          premium to continue.
        </CardBody>
        <CardFooter className="text-end">
          <Button variant="primary" onClick={checkoutHandler}>
            Buy Premium
          </Button>
        </CardFooter>
      </Card>
    </Container>
  );
};

export default BuyPremium;
