import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import { updatePo } from "../../../../service/service";
import { toast } from "react-toastify";

const ModalUpdatePo = (props) => {
  const { show, handleClose, dataPo, getAllPo } = props;
  const [selectedDateStart, setSelectedDateStart] = useState(null);
  const [selectedDateEnd, setSelectedDateEnd] = useState(null);
  const [po, setPo] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isValidate, setIsValidate] = useState("");
  const [contractNumber, setContractNumber] = useState("")

  // check if show then get data po
  useEffect(() => {
    if (show) {
      setPo(dataPo.poNumber);
      localStorage.setItem("po", dataPo.poNumber);
      setQuantity(dataPo.quantity);
      setSelectedDateStart(dataPo.beginAt);
      setSelectedDateEnd(dataPo.endAt);
      setContractNumber(dataPo.contractNumber)
    }
  }, [dataPo]);

  // handle change date start
  const handleDateChangeStart = (date) => {
    setSelectedDateStart(date);
  };

  // handle change date end
  const handleDateChangeEnd = (date) => {
    setSelectedDateEnd(date);
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

  // handle update po
  const handleUpdatePo = async () => {
    if(selectedDateStart >= selectedDateEnd) {
      setIsValidate("Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
      return;
    } else {
      setIsValidate("")
    }
    if(quantity <=0 ) {
      setIsValidate("Số lượng phải lớn hơn 0");
      return;
    } else {
      setIsValidate("")
    }
    // convert start and end dates to long
    const endDate = new Date(selectedDateEnd).getTime();
    const startDate = new Date(selectedDateStart).getTime();
    // call api
    let res = await updatePo(contractNumber, po, quantity, startDate, endDate);
    if (res && res.statusCode === 200) {
      handleClose();
      toast.success("Cập nhật thông tin thành công !!");
      localStorage.removeItem("po");
      getAllPo();
    } else {
      if (
        res &&
        res.statusCode === 205 &&
        res.statusMessage === "YOU CAN ONLY UPDATE WITHIN THE FIRST 15 MINUTES"
      ) {
        setIsValidate(
          "Bạn chỉ được phép chỉnh sửa số lượng!!"
        );
      } else if (
        res &&
        res.statusCode === 205
      ) {
        setIsValidate("Số PO đã tồn tại");
      } else {
        setIsValidate("");
        handleClose();
        toast.error("Cập nhật thông tin không thành công !!");
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
          <Modal.Title>Update PO</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body-add-new">
            <div>
              <div className="validate-add-po">{isValidate}</div>
              <form>
                <div className="form-group mb-3">
                  <label htmlFor="exampleInputEmail9">Số hợp đồng</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail9"
                    aria-describedby="emailHelp"
                    placeholder="Nhập số PO"
                    value={contractNumber}
                    onChange={(event) => setContractNumber(event.target.value)}
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
                    dateFormat="dd/MM/yyyy"
                    showYearDropdown
                    showMonthDropdown
                    customInput={<CustomInput />}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="exampleInputPassword4">Ngày kết thúc</label>
                  <DatePicker
                    selected={selectedDateEnd}
                    onChange={handleDateChangeEnd}
                    dateFormat="dd/MM/yyyy"
                    showYearDropdown
                    showMonthDropdown
                    customInput={<CustomInput />}
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
          <Button variant="primary" onClick={handleUpdatePo}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalUpdatePo;
