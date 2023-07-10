import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./modalupdatepodetail.scss";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import { updatePoDetail } from "../../../../service/service";
import { toast } from "react-toastify";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import moment from "moment";

const ModalUpdatePoDetail = (props) => {

  const { show, handleCloses, dateEditPoDetail, getProducts } = props;
  const [selectedDateStart, setSelectedDateStart] = useState(null);
  const [selectedDateWarrity, setSelectedDateWarrity] = useState(null);
  const [po, setPo] = useState("");
  const [productId, setProductId] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [bbbg, setBbbg] = useState("");
  const [importDate, setImportDate] = useState("");
  const [repairCategory, setRepairCategory] = useState("");
  const [isValidate, setIsValidate] = useState("");
  const [repairStatus, setRepairStatus] = useState("");
  const [exportPartner, setExportPartner] = useState("");
  const [kcsVT, setKcsVT] = useState("");
  const [warrantyPeriod, setWarrantyPeriod] = useState("");
  const [poDetailId, setPoDetailId] = useState("");
  const [prioritize, setPrioritize] = useState("")

  // check if show then get data po detail
  useEffect(() => {
    // convert date import and warranty, format date dd/mm/yy
    const time = dateEditPoDetail.importDate;
    const data = moment(time).format("DD/MM/YYYY");
    const timeWarranty = dateEditPoDetail.warrantyPeriod;
    const dataWarranty = moment(timeWarranty).format("DD/MM/YYYY");
    if (show) {
      setPoDetailId(dateEditPoDetail.poDetailId);
      setProductId(dateEditPoDetail.product.productId);
      setSerialNumber(dateEditPoDetail.serialNumber);
      setPo(dateEditPoDetail.po.poNumber);
      setBbbg(dateEditPoDetail.bbbgNumber);
      setImportDate(data);
      setSelectedDateStart(dateEditPoDetail.importDate);
      setRepairCategory(dateEditPoDetail.repairCategory);
      setRepairStatus(dateEditPoDetail.repairStatus);
      setExportPartner(dateEditPoDetail.exportPartner);
      setKcsVT(dateEditPoDetail.kcsVT);
      setWarrantyPeriod(dataWarranty);
      setSelectedDateWarrity(dateEditPoDetail.warrantyPeriod);
      setPrioritize(dateEditPoDetail.priority);
    }
  }, [dateEditPoDetail]);

  // handle change state date
  const handleDateChangeStart = (date) => {
    setSelectedDateStart(date);
  };

  // handle change end date
  const handleDateChangeWarranty = (date) => {
    setSelectedDateWarrity(date);
  };

  // custom icon calendar input
  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <div className="custom-input">
      <input
        ref={ref}
        type="text"
        className="form-control"
        value={value}
        onClick={onClick}
        readOnly
      />
      <div className="icon-container" onClick={onClick}>
        <FaCalendarAlt className="calendar-icon" />
      </div>
    </div>
  ));

  // handle update po detail
  const handleUpdatePoDetail = async () => {
    // convert date warranty and start date to long
    const WarrantyDate = new Date(selectedDateWarrity).getTime();
    const startDate = new Date(selectedDateStart).getTime();
    // call api update po detail
    let res = await updatePoDetail(
      poDetailId,
      bbbg,
      startDate,
      repairCategory,
      prioritize,
      repairStatus,
      exportPartner,
      kcsVT,
      WarrantyDate
    );
    if (res && res.statusCode === 200) {
      toast.success("Cập nhật thành công !!!");
      getProducts(0);
      handleCloses();
    } else {
      toast.error("Cập nhật thất bại !!!");
    }
  };

  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal show={show} onHide={handleCloses} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Update Po Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body-add-new">
            <div>
              <div className="validate-add-po">{isValidate}</div>
              <form className="input-po-detail">
                <Row className="mb-3 ">
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>Mã hàng hóa</Form.Label>
                    <Form.Control
                      required
                      readOnly
                      disabled
                      value={productId}
                      type="text"
                      placeholder="Mã hàng hóa"
                      onChange={(event) => setProductId(event.target.value)}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustom02">
                    <Form.Label>Số serial hỏng</Form.Label>
                    <Form.Control
                      required
                      readOnly
                      disabled
                      type="text"
                      placeholder="Số serial hỏng"
                      value={serialNumber}
                      onChange={(event) => setSerialNumber(event.target.value)}
                    />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    md="4"
                    controlId="validationCustomUsername1"
                  >
                    <Form.Label>Số PO</Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        type="text"
                        placeholder="Số PO"
                        required
                        disabled
                        readOnly
                        value={po}
                        onChange={(e) => setPo(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                </Row>
                <Row className="mb-3 ">
                  <Form.Group as={Col} md="4" controlId="validationCustom03">
                    <Form.Label>Số BBBG</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Số BBBG"
                      value={bbbg}
                      readOnly
                      disabled
                      onChange={(e) => setBbbg(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustom04">
                    <Form.Label>Ngày nhập</Form.Label>
                    <DatePicker
                      selected={selectedDateStart}
                      onChange={handleDateChangeStart}
                      dateFormat="dd/MM/yyyy"
                      showYearDropdown
                      showMonthDropdown
                      customInput={<CustomInput />}
                      disabled={
                        localStorage.getItem("role") !== "ROLE_ADMIN" &&
                        localStorage.getItem("role") !== "ROLE_MANAGER"
                      }
                    />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    md="4"
                    controlId="validationCustomUsername2"
                  >
                    <Form.Label>Hạng mục SC</Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      disabled={
                        localStorage.getItem("role") !== "ROLE_ADMIN" &&
                        localStorage.getItem("role") !== "ROLE_MANAGER"
                      }
                      value={repairCategory}
                      onChange={(event) => {
                        const value = event.target.value;
                        setRepairCategory(value === "Tất cả" ? null : value);
                      }}
                    >
                      <option value="0">Nhập kho SC</option>
                      <option value="1">Nhập kho BH</option>
                    </Form.Select>
                  </Form.Group>
                </Row>
                <Row className="mb-3 ">
                  <Form.Group as={Col} md="4" controlId="validationCustom099">
                    <Form.Label>Ưu tiên SC</Form.Label>
                    <Form.Select
                      aria-label="Default select example111"
                      disabled={
                        localStorage.getItem("role") !== "ROLE_ADMIN" &&
                        localStorage.getItem("role") !== "ROLE_MANAGER"
                      }
                      value={prioritize}
                      onChange={(event) => {
                        const value = event.target.value;
                        setPrioritize(value === "Tất cả" ? null : value);
                      }}
                    >
                      <option value="1">Ưu tiên</option>
                      <option value="0">Không ưu tiên</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustom05">
                    <Form.Label>Cập nhật SC</Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      value={repairStatus}
                      onChange={(event) => {
                        const value = event.target.value;
                        setRepairStatus(value === "Tất cả" ? null : value);
                      }}
                      disabled={
                        localStorage.getItem("role") !== "ROLE_ADMIN" &&
                        localStorage.getItem("role") !== "ROLE_MANAGER" &&
                        localStorage.getItem("role") !== "ROLE_REPAIRMAN"
                      }
                    >
                      <option value="0">Sửa chữa không được</option>
                      <option value="1">Sửa chữa xong</option>
                      <option value="2">Cháy nổ</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustom06">
                    <Form.Label>Cập nhật XK</Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      disabled={
                        localStorage.getItem("role") !== "ROLE_ADMIN" &&
                        localStorage.getItem("role") !== "ROLE_MANAGER"
                      }
                      value={exportPartner}
                      onChange={(event) => {
                        const value = event.target.value;
                        setExportPartner(value === "Tất cả" ? null : value);
                      }}
                    >
                      <option value="0">Chưa xuất kho</option>
                      <option value="1">Xuất kho</option>
                    </Form.Select>
                  </Form.Group>
                </Row>
                <Row className="mb-3 ">
                  <Form.Group as={Col} md="6" controlId="validationCustom07">
                    <Form.Label>Cập nhật KCS</Form.Label>
                    <Form.Select
                      aria-label="Default select example1"
                      disabled={
                        localStorage.getItem("role") !== "ROLE_ADMIN" &&
                        localStorage.getItem("role") !== "ROLE_MANAGER" &&
                        localStorage.getItem("role") !== "ROLE_KCSANALYST"
                      }
                      value={kcsVT}
                      onChange={(event) => {
                        const value = event.target.value;
                        setKcsVT(value === "Tất cả" ? null : value);
                      }}
                    >
                      <option value="0">FAIL</option>
                      <option value="1">PASS</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group as={Col} md="6" controlId="validationCustom08">
                    <Form.Label>Cập nhật BH</Form.Label>
                    <DatePicker
                      selected={selectedDateWarrity}
                      onChange={handleDateChangeWarranty}
                      dateFormat="dd/MM/yyyy"
                      showYearDropdown
                      showMonthDropdown
                      customInput={<CustomInput />}
                      disabled={
                        localStorage.getItem("role") !== "ROLE_ADMIN" &&
                        localStorage.getItem("role") !== "ROLE_MANAGER"
                      }
                    />
                  </Form.Group>
                </Row>
              </form>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloses}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdatePoDetail}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalUpdatePoDetail;
