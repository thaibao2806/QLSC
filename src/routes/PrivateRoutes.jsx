import React from "react";
import { useContext } from "react";
import { UserContext } from "../Context/UseContext";
import Alert from "react-bootstrap/Alert";
import "./privateroute.scss";

const PrivateRoutes = (props) => {
  const { user } = useContext(UserContext);

  if (user && !user.auth) {
    return (
      <>
        <Alert variant="danger" className=" error-login">
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>Đăng nhập để hiển thị</p>

          <a href="/"> Về trang chủ</a>
        </Alert>
      </>
    );
  }

  return <>{props.children}</>;
};

export default PrivateRoutes;
