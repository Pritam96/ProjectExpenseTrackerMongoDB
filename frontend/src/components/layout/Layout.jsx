import { Fragment } from "react";
import Header from "./Header";
import { ToastContainer } from "react-toastify";

const Layout = (props) => {
  return (
    <Fragment>
      <Header />
      <ToastContainer />
      <main>{props.children}</main>
    </Fragment>
  );
};

export default Layout;
