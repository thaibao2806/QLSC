import { React, useEffect, useState } from "react";
import "./admin.scss";
import { Table } from "react-bootstrap";
import { AiFillFileAdd, AiOutlineSearch } from "react-icons/ai";
import { toast } from "react-toastify";
import { useContext } from "react";
import { UserContext } from "../../Context/UseContext";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { GiEarthAsiaOceania } from "react-icons/gi";
import { RxAvatar } from "react-icons/rx";
import { NavLink, useNavigate } from "react-router-dom";
import ModalAddUser from "../Modal/USER/ModalAddUser/ModalAddUser";
import ModalDeleteUser from "../Modal/USER/ModalDeleteUser/ModalDeleteUser";
import ModalUpdateUser from "../Modal/USER/ModalUpdateUser/ModalUpdateUser";
import { getUserAdmin } from "../../service/service";
import _ from "lodash";

const Admin = () => {
  const [isShowAddUser, setIsShowAddUser] = useState(false);
  const [isShowDeleteUser, setIsShowDeleteUser] = useState(false);
  const [isShowUpdateUser, setIsShowUpdateUser] = useState(false);
  const [listUser, setListUser] = useState("");
  const [search, setSearch] = useState("");
  const [dataEditUser, setDataEditUser] = useState();
  const [dataDeleteUser, setDataDeleteUser] = useState();
  const { logoutContextAdmin, user, loginContextAdmin } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
    if (localStorage.getItem("email")) {
      loginContextAdmin(localStorage.getItem("email"));
    }
  }, []);

  const getUser = async () => {
    let res = await getUserAdmin();
    console.log(res);
    if (res && res.data) {
      setListUser(res.data);
    }
  };

  const handleLogout = () => {
    logoutContextAdmin();
    navigate("/");
    toast.success("Đăng xuất thành công!");
  };
  const handleCloses = () => {
    setIsShowAddUser(false);
    setIsShowDeleteUser(false);
    setIsShowUpdateUser(false);
    getUser();
  };

  const handleSearch = () => {
    if (search) {
      let cloneListUser = _.cloneDeep(listUser);
      cloneListUser = listUser.filter(
        (item) =>
          item.fullName.toLowerCase().includes(search.toLowerCase()) ||
          item.email.toLowerCase().includes(search.toLowerCase()) ||
          item.phoneNumber.toLowerCase().includes(search.toLowerCase())
      );
      setListUser(cloneListUser);
    } else {
      getUser();
    }
  };

  const handleRoleSelect = (role) => {
    if (role) {
      console.log(role);
      let cloneListUser = _.cloneDeep(listUser);
      cloneListUser = listUser.filter(
        (item) => item.roles[0].roleName === role
      );
      setListUser(cloneListUser);
    }
    if (role === "all") {
      getUser();
    }
  };

  const hanldeEditUser = (user) => {
    setDataEditUser(user);
    setIsShowUpdateUser(true);
  };

  const handleDeleteUser = (user) => {
    setIsShowDeleteUser(true);
    setDataDeleteUser(user);
    console.log(user);
    let cloneListUser = _.cloneDeep(listUser);
    cloneListUser = listUser.filter((item) => item.email !== user.email);
    console.log(cloneListUser);
    setListUser(cloneListUser);
  };

  return (
    <div className="admin">
      <div className="navbars shadow-sm  bg-white rounded">
        <Navbar bg="" expand="lg" className="px-4">
          <Navbar.Brand href="/admin">
            <div className="header-logo">
              <GiEarthAsiaOceania className="icon-ocean" />
              OCEAN QLSC
            </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavLink to="/admin" className="nav-link">
                Quản lý User
              </NavLink>
            </Nav>
            <Nav>
              {user && user.email ? (
                <span className="nav-link">{user.email}</span>
              ) : (
                <RxAvatar className="icon-avatar" />
              )}
            </Nav>
            <Nav>
              {user && user.auth === true ? (
                <NavDropdown.Item
                  onClick={() => handleLogout()}
                  className="nav-link"
                >
                  Đăng xuất
                </NavDropdown.Item>
              ) : (
                <NavLink to="/signin" className="nav-link">
                  Đăng nhập
                </NavLink>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
      <div className="po-table">
        <div className="my-3 add-new d-flex justify-content-between">
          <div className="col-3 btn-search input-group w-25">
            <input
              className="form-control"
              placeholder="Search..."
              onChange={(event) => setSearch(event.target.value)}
            />
            <button className="btn btn-primary" onClick={() => handleSearch()}>
              <AiOutlineSearch />
            </button>
          </div>
          <div className="group-btn d-flex">
            <div className="update">
              <button
                className="btn btn-success"
                onClick={() => setIsShowAddUser(true)}
              >
                <AiFillFileAdd />
                Add New User
              </button>
            </div>
          </div>
        </div>
        <Table striped bordered className="table-shadow">
          <thead>
            <tr>
              <th>Stt</th>
              <th>Họ và tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>
                <NavDropdown title="Quyền" className="role-user">
                  <NavDropdown.Item
                    onClick={() => handleRoleSelect("ROLE_ADMIN")}
                  >
                    admin
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => handleRoleSelect("ROLE_USER")}
                  >
                    user
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => handleRoleSelect("ROLE_MANAGER")}
                  >
                    manager
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleRoleSelect("all")}>
                    Tất cả
                  </NavDropdown.Item>
                </NavDropdown>
              </th>
              <th>Trạng thái</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {listUser &&
              listUser.length > 0 &&
              listUser.map((item, index) => {
                console.log("check role", item.roles[0].roleName);
                if (item.removed === true) {
                  return null;
                }
                return (
                  <tr key={`sc-${index}`}>
                    <td>{index + 1}</td>
                    <td>{item.fullName}</td>
                    <td>{item.email}</td>
                    <td>{item.phoneNumber}</td>
                    <td>{item.roles[0].roleName}</td>
                    <td>
                      {item.status === 0 && "Mới"}
                      {item.status === 1 && "Đã đổi mật khẩu"}
                      {item.status === 2 && "Đã xóa"}
                    </td>
                    <td>
                      {item.status !== 2 && (
                        <>
                          <button
                            className="btn btn-warning mx-1"
                            onClick={() => hanldeEditUser(item)}
                          >
                            Edit
                          </button>
                          {item.email !== localStorage.getItem("email") && (
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDeleteUser(item)}
                            >
                              Delete
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>

      <ModalAddUser show={isShowAddUser} handleClose={handleCloses} />

      <ModalDeleteUser
        show={isShowDeleteUser}
        handleClose={handleCloses}
        dataDeleteUser={dataDeleteUser}
      />
      <ModalUpdateUser
        show={isShowUpdateUser}
        handleClose={handleCloses}
        dataEditUser={dataEditUser}
      />
    </div>
  );
};

export default Admin;
