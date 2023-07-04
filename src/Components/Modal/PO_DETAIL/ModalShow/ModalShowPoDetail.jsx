import React, { useEffect, useState } from "react";
import "./modalshowproduct.scss";
import { Modal, Button } from "react-bootstrap";
import { FaCalendarAlt } from "react-icons/fa";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import moment from "moment";

const ModalShowPoDetail = (props) => {
  const { show, handleCloses, dateShowPoDetail } = props;
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
  const [productName, setProductName] = useState("");

  useEffect(() => {
    const time = dateShowPoDetail.importDate;
    const data = moment(time).format("DD/MM/YYYY");
    const timeWarranty = dateShowPoDetail.warrantyPeriod;
    const dataWarranty = moment(timeWarranty).format("DD/MM/YYYY");
    if (show) {
      setProductId(dateShowPoDetail.product.productId);
      setProductName(dateShowPoDetail.product.productName);
      setSerialNumber(dateShowPoDetail.serialNumber);
      setPo(dateShowPoDetail.po.poNumber);
      setBbbg(dateShowPoDetail.bbbgNumber);
      setImportDate(data);
      setRepairCategory(dateShowPoDetail.repairCategory);
      setRepairStatus(dateShowPoDetail.repairStatus);
      setExportPartner(dateShowPoDetail.exportPartner);
      setKcsVT(dateShowPoDetail.kcsVT);
      setWarrantyPeriod(dataWarranty);
    }
  }, [dateShowPoDetail]);

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

  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal show={show} onHide={handleCloses} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết Po Detail</Modal.Title>
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
                      type="text"
                      placeholder="Số serial hỏng"
                      value={serialNumber}
                      onChange={(event) => setSerialNumber(event.target.value)}
                    />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    md="4"
                    controlId="validationCustomUsername"
                  >
                    <Form.Label>Số PO</Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        type="text"
                        placeholder="Số PO"
                        required
                        readOnly
                        value={po}
                        onChange={(e) => setPo(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                </Row>
                <Row className="mb-3 ">
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label>Tên thiết bị</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={productName}
                      readOnly
                      onChange={(event) => setProductName(event.target.value)}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3 ">
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>Số BBBG</Form.Label>
                    <Form.Control
                      required
                      readOnly
                      type="text"
                      placeholder="Số BBBG"
                      value={bbbg}
                      onChange={(e) => setBbbg(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustom02">
                    <Form.Label>Ngày nhập</Form.Label>
                    <Form.Control
                      required
                      readOnly
                      type="text"
                      placeholder="Ngày nhập"
                      value={importDate}
                      onChange={(e) => setImportDate(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    md="4"
                    controlId="validationCustomUsername"
                  >
                    <Form.Label>Hạng mục</Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        type="text"
                        placeholder="Hạng mục"
                        required
                        readOnly
                        value={
                          repairCategory === 0 ? "Nhập kho SC" : "Nhập kho BH"
                        }
                        onChange={(e) => setRepairCategory(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                </Row>
                <Row className="mb-3 ">
                  <Form.Group as={Col} md="6" controlId="validationCustom01">
                    <Form.Label>Trạng thái SC</Form.Label>
                    <Form.Control
                      required
                      readOnly
                      type="text"
                      placeholder="Trạng thái SC"
                      value={
                        repairStatus === 0
                          ? "Sửa chữa không được"
                          : repairStatus === 1
                          ? "Sửa chữa xong"
                          : repairStatus === 2
                          ? "Cháy nổ"
                          : "Trạng thái SC"
                      }
                      onChange={(e) => setRepairStatus(e.target.value)}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="6" controlId="validationCustom02">
                    <Form.Label>Xuất kho trả KH</Form.Label>
                    <Form.Control
                      required
                      readOnly
                      type="text"
                      placeholder="Xuất kho trả KH"
                      value={exportPartner === 0 ? "Chưa xuất kho" : "Xuất kho"}
                      onChange={(e) => setExportPartner(e.target.value)}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3 ">
                  <Form.Group as={Col} md="6" controlId="validationCustom01">
                    <Form.Label>KCS VT</Form.Label>
                    <Form.Control
                      required
                      readOnly
                      type="text"
                      placeholder="KCS VT"
                      value={kcsVT === 0 ? "FAIL" : "PASS"}
                      onChange={(e) => setKcsVT(e.target.value)}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="6" controlId="validationCustom02">
                    <Form.Label>Bảo hành</Form.Label>
                    <Form.Control
                      required
                      readOnly
                      type="text"
                      placeholder="Bảo hành"
                      value={warrantyPeriod}
                      onChange={(e) => setWarrantyPeriod(e.target.value)}
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
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalShowPoDetail;
