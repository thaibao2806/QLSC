import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./modalupdateuser.scss";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Dropdown from "react-bootstrap/Dropdown";
import { updateUser, role } from "../../../../service/service";
import { ToastContainer, toast } from "react-toastify";

const ModalUpdateUser = (props) => {
  const { show, handleClose, dataEditUser } = props;
  const [roleName, setRoleName] = useState("Choose Role");
  const [roleID, setRoleID] = useState(null);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [emailUser, setEmailUser] = useState("");
  const [phone, setPhone] = useState("");
  const [validate, setValidate] = useState("");

  useEffect(() => {
    if (show) {
      setFullName(dataEditUser.fullName);
      setEmail(dataEditUser.email);
      localStorage.setItem("emailEdit", dataEditUser.email);
      setPhone(dataEditUser.phoneNumber);
      setRoleName(dataEditUser.roles[0].roleName);
      setRoleID(dataEditUser.roles[0]);
      // handleRole()
      // handleRole2()
    }
  }, [dataEditUser]);

  const handleRole = async () => {
    let res = await role();
    console.log(res.data[0]);
    if (res) {
      setRoleID(res.data[0]);
      setRoleName(res.data[0].roleName);
    }
  };

  const handleRole2 = async () => {
    let res = await role();
    console.log(res.data[1]);
    if (res) {
      setRoleID(res.data[1]);
      setRoleName(res.data[1].roleName);
    }
  };
  const handleRole3 = async () => {
    let res = await role();
    console.log(res.data[2]);
    if (res) {
      setRoleID(res.data[2]);
      setRoleName(res.data[2].roleName);
    }
  };

  const handleUpdateUser = async () => {
    let res = await updateUser(email, fullName, phone, [roleID]);
    if (res && res.statusCode === 200) {
      handleClose();
      toast.success("Cập nhật thông tin thành công !!");
      localStorage.removeItem("emailEdit");
    } else {
      handleClose();
      toast.error("Cập nhật thông tin không thành công !!");
    }
  };

  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate>
            <Row className="mb-2 m-xl-1 validate">{validate}</Row>
            <Row className="mb-3">
              <Form.Group md="4" controlId="validationCustom01">
                <Form.Label>Họ và tên</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Họ và tên"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group md="4" controlId="validationCustom02">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group md="4" controlId="validationCustom03">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Số điện thoại"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group md="4" controlId="validationCustom09">
                <Form.Label>Role</Form.Label>
                <Dropdown>
                  <Dropdown.Toggle variant="light">{roleName}</Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleRole()}>
                      Admin
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleRole2()}>
                      Manager
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleRole3()}>
                      User
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateUser}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalUpdateUser;
