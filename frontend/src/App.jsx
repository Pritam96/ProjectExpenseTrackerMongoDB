import { Navigate, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Fragment } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { useSelector } from "react-redux";
import Expenses from "./pages/Expenses";
import Export from "./pages/Export";
import Reports from "./pages/Reports";
import Layout from "./components/layout/Layout";

const App = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <Fragment>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/expense" /> : <Home />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset/:token" element={<ResetPassword />} />

          {user && <Route path="/expense" element={<Expenses />} />}
          {user && <Route path="/export" element={<Export />} />}
          {user && <Route path="/reports" element={<Reports />} />}

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Fragment>
  );
};

export default App;
