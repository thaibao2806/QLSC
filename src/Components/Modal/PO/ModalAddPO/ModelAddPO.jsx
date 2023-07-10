import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import "./modeladdpo.scss";
import { toast } from "react-toastify";
import { createPo } from "../../../../service/service";

const ModelAddPO = (props) => {

  const { show, handleClose, getAllPo } = props;
  const [selectedDateStart, setSelectedDateStart] = useState(null);
  const [selectedDateEnd, setSelectedDateEnd] = useState(null);
  const [po, setPo] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isValidate, setIsValidate] = useState("");
  const [contract, setContract] = useState("")

  //handle change date start
  const handleDateChangeStart = (date) => {
    setSelectedDateStart(date);
  };

  // handle change date end
  const handleDateChangeEnd = (date) => {
    setSelectedDateEnd(date);
  };

  // custom input icon calendar
  const CustomInput = ({ value, onClick }) => (
    <div className="custom-input">
      <input
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
  );

  // handle add po
  const handleAddPO = async () => {
    // validate
    if (
      !contract ||
      !po ||
      !quantity ||
      !selectedDateStart ||
      !selectedDateStart
    ) {
      setIsValidate("Cần nhập đầy đủ thông tin");
      return
    } else {
      setIsValidate("");
    } 
    if (quantity <= 0) {
      setIsValidate("Số lượng phải lớn hơn 0");
      return
    }else {
      setIsValidate("");
    } 
    if (selectedDateStart >= selectedDateEnd) {
      setIsValidate("Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
      return
    } else {
      setIsValidate("");
    }

    let res = await createPo(
      contract,
      po,
      quantity,
      selectedDateStart.getTime(),
      selectedDateEnd.getTime()
    );

    // call api
    if (res && res.statusCode === 200) {
      toast.success("Thêm thành công!!");
      toast.warning("Bạn chỉ có thể chỉnh sửa trong 15 phút đầu!!");
      setContract("")
      setPo("");
      setQuantity("");
      setSelectedDateEnd("");
      setSelectedDateStart("");
      getAllPo();
      handleClose();
    } else {
      if (
        res &&
        res.statusCode === 205
      ) {
        setIsValidate("PO đã tồn tại");
      } else {
        setIsValidate("")
      }
    }
  };

  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add new PO</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body-add-new">
            <div>
              <div className="validate-add-po">{isValidate}</div>
              <form>
                <div className="form-group mb-3">
                  <label htmlFor="exampleInputEmail1">Số hợp đồng</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail9"
                    aria-describedby="emailHelp"
                    placeholder="Nhập số hợp đồng"
                    value={contract}
                    onChange={(event) => setContract(event.target.value)}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="exampleInputEmail1">Số PO</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder="Nhập số PO"
                    value={po}
                    onChange={(event) => setPo(event.target.value)}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="exampleInputPassword1">Số lượng</label>
                  <input
                    type="number"
                    className="form-control"
                    id="exampleInputPassword1"
                    placeholder="Nhập số lượng"
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="exampleInputPassword3">Ngày bắt đầu</label>
                  <DatePicker
                    selected={selectedDateStart}
                    onChange={handleDateChangeStart}
                    customInput={<CustomInput />}
                    dateFormat="dd/MM/yyyy"
                    showYearDropdown
                    showMonthDropdown
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="exampleInputPassword4">Ngày kết thúc</label>
                  <DatePicker
                    selected={selectedDateEnd}
                    onChange={handleDateChangeEnd}
                    customInput={<CustomInput />}
                    dateFormat="dd/MM/yyyy"
                    showYearDropdown
                    showMonthDropdown
                  />
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddPO}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModelAddPO;
