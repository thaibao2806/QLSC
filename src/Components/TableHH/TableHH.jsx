import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { AiOutlineDownload, AiOutlineSearch } from "react-icons/ai";
import { FaFileImport } from "react-icons/fa";
import { read, utils, writeFile } from "xlsx";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "./tablehh.scss";
import { toast } from "react-toastify";
import _ from "lodash";
import moment from "moment";
import { Modal, Button, Row, InputGroup } from "react-bootstrap";
import NavDropdown from "react-bootstrap/NavDropdown";
import {
  exportByPO,
  fecthAllPoDetail,
  getAllPoDetail,
  getPo,
  searchPODetail,
} from "../../service/service";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import Spinner from "react-bootstrap/Spinner";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import ModalUpdatePoDetail from "../Modal/PO_DETAIL/ModalUpdate/ModalUpdatePoDetail";
import ModalShowPoDetail from "../Modal/PO_DETAIL/ModalShow/ModalShowPoDetail";

export const TableHH = () => {
  const [listPoDetail, setListPoDetail] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isShowNotify, setIsShowNotify] = useState(false);
  const [isShowNotifyUpdateSC, setIsShowNotifyUpdateSC] = useState(false);
  const [isShowNotifyUpdateXK, setIsShowNotifyUpdateXK] = useState(false);
  const [isShowNotifyUpdateKCS, setIsShowNotifyUpdateKCS] = useState(false);
  const [isShowNotifyUpdateBH, setIsShowNotifyUpdateBH] = useState(false);
  const [data, setData] = useState([]);
  const [selectedDateStart, setSelectedDateStart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dateEditPoDetail, setDataEditPoDetail] = useState("");
  const [dateShowPoDetail, setDataShowPoDetail] = useState("");
  const [listAllPoDetail, setListAllPoDetail] = useState("");
  const [isShowEditPoDetail, setisShowEditPoDetail] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [isShowPoDetail, setIsShowPoDetail] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedOption, setSelectedOption] = useState("10");
  const [checkboxes, setCheckboxes] = useState({
    defaultCheck1: false,
    defaultCheck2: false,
    defaultCheck3: false,
    defaultCheck4: false,
  });
  const [productId, setProductId] = useState(null);
  const [serialNumber, setSerialNumber] = useState(null);
  const [poNumber, setPoNumber] = useState(null);
  const [bbbg, setBbbg] = useState(null);
  const [importDate, setImportDate] = "";
  const [repairCategory, setRepairCategory] = useState(null);
  const [repairStatus, setRepairStatus] = useState(null);
  const [exportPartner, setExportPartner] = useState(null);
  const [kcsVt, setKcsVt] = useState(null);
  const [po, setPo] = useState("getAll")
  const [listPo, setListPo] = useState("")

  // call api when load page
  useEffect(() => {
    if(productId ||
        serialNumber ||
        poNumber ||
        bbbg ||
        selectedDateStart ||
        repairCategory ||
        repairStatus ||
        exportPartner ||
        kcsVt) {
        handleSearch(0);
        } else {
          getProducts(0);
          getAllPO()
        }
    
  }, [selectedOption]);

  // handle change date start
  const handleDateChangeStart = (date) => {
    setSelectedDateStart(date);
  };

  // custom input icon calendar
  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <div className="custom-input">
      <input
        type="text"
        className="form-control"
        value={value}
        onClick={onClick}
        ref={ref}
        readOnly
      />
      <div className="icon-container" onClick={onClick}>
        <FaCalendarAlt className="calendar-icon" />
      </div>
    </div>
  ));

  // call api get product by page
  const getProducts = async (page) => {
    try {
      let res = await fecthAllPoDetail(page, selectedOption);
      if (res && res.data) {
        setListPoDetail(res.data);
        setTotalProducts(res.totalPages);
        setTotalPages(res.data.number);
      }
    } catch (error) {
      setLoadingMessage("Lỗi khi tải dữ liệu.");
    }
  };

  // call api get all po
  const getAllPO = async() => {
    let res = await getPo()
    if(res && res.statusCode === 200) {
      setListPo(res.data)
    }
  }
  // import po detail
  const handleFileUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (
        file.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        toast.error("Vui lòng chỉ chọn tệp tin định dạng .xlsx!");
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      setIsLoading(true);
      let response = await axios.post(
        "http://localhost:8080/po-detail/import",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            email: localStorage.getItem("email"),
          },
        }
      );
      console.log(response);
      if (response.data.statusCode === 200) {
        toast.success("Dữ liệu đã được tải thành công!");
        setIsShowNotify(true);
        setData(response.data.data);
        getProducts(0);
      } else {
        toast.error("Dữ liệu đã được tải không thành công!");
        setData(response.data.data);
        setIsShowNotify(true);
      }
    } catch (error) {
      toast.error("Dữ liệu đã được tải không thành công!");
    } finally {
      setIsLoading(false);
      event.target.value = null; // Reset giá trị của input file
    }
  };

  // handle import status po detail
  const handleUploadSC = async (event) => {
    try {
      const selectedState = event.target.id;
      let selectUpdateValue = "";

      if (selectedState === "test1") {
        selectUpdateValue = "repairStatus";
      } else if (selectedState === "test2") {
        selectUpdateValue = "exportPartner";
      } else if (selectedState === "test3") {
        selectUpdateValue = "kcsVT";
      } else if (selectedState === "test4") {
        selectUpdateValue = "warrantyPeriod";
      }

      const file = event.target.files[0];

      if (
        file.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        toast.error("Vui lòng chỉ chọn tệp tin định dạng .xlsx!");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("attribute", selectUpdateValue);
      setIsLoading(true);
      let response = await axios.post(
        "http://localhost:8080/po-detail/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            email: localStorage.getItem("email"),
          },
        }
      );

      if (response.data.statusCode === 200) {
        toast.success("Dữ liệu đã được tải thành công!");
        setIsShowNotify(true);
        setData(response.data.data);
        getProducts(0);
      } else {
        toast.error("Dữ liệu đã được tải không thành công!");
        setData(response.data.data);
        setIsShowNotify(true);
      }
    } catch (error) {
      toast.error("Dữ liệu đã được tải không thành công!");
    } finally {
      setIsLoading(false);
      event.target.value = null;
    }
  };

  // Page
  const itemsPerPage = selectedOption;
  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    const newStartIndex = selectedPage * itemsPerPage;
    setStartIndex(newStartIndex);
    if (
      productId ||
      serialNumber ||
      poNumber ||
      bbbg ||
      selectedDateStart ||
      repairCategory ||
      repairStatus ||
      exportPartner ||
      kcsVt
    ) {
        handleSearch(+event.selected);
    } else {
      getProducts(+event.selected);
    }
  };

  // Export

  const handleExport = async() => {
    let selectedData = [];
    let selectedColumns = [
      "Mã HH",
      "Số serial hỏng",
      "Số PO",
      "Số BBBG",
      "Ngày nhập",
      "Hạng mục",
    ];

    if (checkboxes.defaultCheck1) {
      selectedColumns.push("Trạng thái SC");
    }

    if (checkboxes.defaultCheck2) {
      selectedColumns.push("Xuất kho trả KH");
    }

    if (checkboxes.defaultCheck3) {
      selectedColumns.push("KCS VT");
    }

    if (checkboxes.defaultCheck4) {
      selectedColumns.push("Bảo Hành");
    }

    selectedColumns.unshift("STT");

    if (
      checkboxes.defaultCheck1 ||
      checkboxes.defaultCheck2 ||
      checkboxes.defaultCheck3 ||
      checkboxes.defaultCheck4
    ) {
    
      let res = await exportByPO(po)
      if(res && res.statusCode === 200) {
        selectedData = res.data;
      }
      
      // selectedData = data.filter((item) => item.serialNumber);
      const exportData = [
        selectedColumns,
        ...selectedData.map((item, index) => {
          return [
            index + 1,
            ...selectedColumns.slice(1).map((column) => {
              if (column === "Mã HH") {
                return item.product.productId;
              }
              if (column === "Số serial hỏng") {
                return item.serialNumber;
              }
              if (column === "Số PO") {
                return item.po.poNumber;
              }
              if (column === "Số BBBG") {
                return item.bbbgNumber;
              }
              if (column === "Ngày nhập") {
                return moment(item.importDate).format("DD/MM/YYYY");
              }
              if (column === "Hạng mục") {
                return item.repairCategory;
              }
              if (column === "Trạng thái SC") {
                return item.repairStatus;
              }
              if (column === "Xuất kho trả KH") {
                return item.exportPartner;
              }
              if (column === "KCS VT") {
                return item.kcsVT;
              }
              if (column === "Bảo Hành") {
                return moment(item.warrantyPeriod).format("DD/MM/YYYY");
              }
            }),
          ];
        }),
      ];

      const workbook = utils.book_new();
      const worksheet = utils.aoa_to_sheet(exportData);
      utils.book_append_sheet(workbook, worksheet, "Sheet1");

      writeFile(workbook, "data.xlsx");
    }
  };

  // export notify error when import
  const handleExportNotify = () => {
    const columnHeader = ["Loại lỗi", "Số hàng", "Mô tả lỗi"];
    const dataArray = [columnHeader, ...data.map((obj) => Object.values(obj))];
    const workbook = utils.book_new();
    const worksheet = utils.aoa_to_sheet(dataArray);
    utils.book_append_sheet(workbook, worksheet, "Sheet1");

    writeFile(workbook, "mo_ta_po_detail.xlsx");
  };

  // handle close modal
  const handleCloses = () => {
    setIsShowNotify(false);
    setIsShowNotifyUpdateSC(false);
    setIsShowNotifyUpdateXK(false);
    setIsShowNotifyUpdateKCS(false);
    setIsShowNotifyUpdateBH(false);
    setisShowEditPoDetail(false);
    setIsShowPoDetail(false);
  };

  // Search

  const handleSearch = async (page) => {
    let time = selectedDateStart;

    if (selectedDateStart !== null) {
      time = moment(selectedDateStart).format("DD/MM/YYYY");
    }
    let res = await searchPODetail(
      [
        productId,
        serialNumber,
        poNumber,
        bbbg,
        time,
        repairCategory,
        repairStatus,
        exportPartner,
        kcsVt,
      ],
      "ALL",
      page,
      selectedOption
    );
    if (res && res.statusCode === 200) {
      setListPoDetail(res.data);
      setTotalProducts(res.totalPages);
      setTotalPages(res.data.number);
    }
  };

  // handle edit po detail
  const handleEditPoDetail = (item) => {
    setisShowEditPoDetail(true);
    setDataEditPoDetail(item);
    console.log("tui check", item);
  };

  // hanle show po detail
  const handleShowPoDetail = (item) => {
    setIsShowPoDetail(true);
    setDataShowPoDetail(item);
  };

  return (
    <>
      <div className="tables">
        <div className="table-action">
          <div>
            <Row className="mb-3">
              <Form.Group as={Col} md="2" controlId="validationCustom01">
                <Form.Label>Mã hàng hóa</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={productId !== null ? productId : ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    setProductId(value !== "" ? value : null);
                  }}
                  placeholder="Mã hàng hóa"
                />
              </Form.Group>
              <Form.Group as={Col} md="2" controlId="validationCustom02">
                <Form.Label>Số serial</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={serialNumber !== null ? serialNumber : ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    setSerialNumber(value !== "" ? value : null);
                  }}
                  placeholder="Số serial"
                />
              </Form.Group>
              <Form.Group as={Col} md="2" controlId="validationCustomUsername1">
                <Form.Label>Số PO</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={(event) => {
                    const value = event.target.value;
                    setPoNumber(value === "Tất cả PO" ? null : value);
                  }}
                >
                  <option>Tất cả PO</option>
                  {listPo &&
                    listPo.length > 0 &&
                    listPo.map((item, index) => {
                      return (
                        <option key={index} value={item.poNumber}>
                          {item.poNumber}
                        </option>
                      );
                    })}
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} md="2" controlId="validationCustomUsername2">
                <Form.Label>Số BBBG</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    placeholder="Số BBBG"
                    value={bbbg !== null ? bbbg : ""}
                    onChange={(event) => {
                      const value = event.target.value;
                      setBbbg(value !== "" ? value : null);
                    }}
                    aria-describedby="inputGroupPrepend"
                    required
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="2" controlId="validationCustomUsername3">
                <Form.Label>Ngày nhập</Form.Label>
                <div className="">
                  <DatePicker
                    selected={selectedDateStart}
                    onChange={handleDateChangeStart}
                    customInput={<CustomInput />}
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col} md="2" controlId="validationCustomUsername4">
                <Form.Label>Hạng mục</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={(event) => {
                    const value = event.target.value;
                    setRepairCategory(value === "Tất cả" ? null : value);
                  }}
                >
                  <option>Tất cả</option>
                  <option value="0">Nhập kho sửa chữa</option>
                  <option value="1">Nhập kho bảo hành</option>
                </Form.Select>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="2" controlId="validationCustom03">
                <Form.Label>Trạng thái SC</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={(event) => {
                    const value = event.target.value;
                    setRepairStatus(value === "Tất cả" ? null : value);
                  }}
                >
                  <option>Tất cả</option>
                  <option value="0">Sửa chữa không được</option>
                  <option value="1">Sửa chữa xong</option>
                  <option value="2">Cháy nổ</option>
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} md="2" controlId="validationCustom04">
                <Form.Label>Xuất kho trả KH</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={(event) => {
                    const value = event.target.value;
                    setExportPartner(value === "Tất cả" ? null : value);
                  }}
                >
                  <option>Tất cả</option>
                  <option value="0">Chưa xuất kho</option>
                  <option value="1">Xuất kho</option>
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} md="2" controlId="validationCustom05">
                <Form.Label>KCS VT</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={(event) => {
                    const value = event.target.value;
                    setKcsVt(value === "Tất cả" ? null : value);
                  }}
                >
                  <option>Tất cả</option>
                  <option value="0">FAIL</option>
                  <option value="1">PASS</option>
                </Form.Select>
              </Form.Group>
            </Row>
            <Row className="mb-3 d-flex justify-content-center align-items-center">
              <Form.Group as={Col} md="2" controlId="validationCustomUsername7">
                <Form.Label>Trạng thái xuất: </Form.Label>
              </Form.Group>
              <Form.Group
                as={Col}
                md="2"
                controlId="validationCustomUsername99"
              >
                {/* <Form.Label>Xuất theo PO</Form.Label> */}
                <Form.Select
                  aria-label="Default select example"
                  onChange={(event) => {
                    const value = event.target.value;
                    setPo(value === "Tất cả PO" ? "getAll" : value);
                  }}
                >
                  <option>Tất cả PO</option>
                  {listPo &&
                    listPo.length > 0 &&
                    listPo.map((item, index) => {
                      return (
                        <option key={index} value={item.poNumber}>
                          {item.poNumber}
                        </option>
                      );
                    })}
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} md="2" controlId="validationCustomUsername8">
                <div className="form-check   label">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={checkboxes.defaultCheck1 || selectAll}
                    onChange={() =>
                      setCheckboxes({
                        ...checkboxes,
                        defaultCheck1: !checkboxes.defaultCheck1,
                      })
                    }
                    id="defaultCheck1"
                  />
                  <label
                    className="form-check-label font-size"
                    htmlFor="defaultCheck1"
                  >
                    Trạng thái SC
                  </label>
                </div>
              </Form.Group>
              <Form.Group as={Col} md="2" controlId="validationCustomUsername9">
                <div className="form-check label">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={checkboxes.defaultCheck2 || selectAll}
                    onChange={() =>
                      setCheckboxes({
                        ...checkboxes,
                        defaultCheck2: !checkboxes.defaultCheck2,
                      })
                    }
                    id="defaultCheck2"
                  />
                  <label
                    className="form-check-label font-size"
                    htmlFor="defaultCheck2"
                  >
                    Xuất kho trả KH
                  </label>
                </div>
              </Form.Group>
              <Form.Group
                as={Col}
                md="2"
                controlId="validationCustomUsername12"
              >
                <div className="form-check label">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={checkboxes.defaultCheck3 || selectAll}
                    onChange={() =>
                      setCheckboxes({
                        ...checkboxes,
                        defaultCheck3: !checkboxes.defaultCheck3,
                      })
                    }
                    id="defaultCheck3"
                  />
                  <label
                    className="form-check-label font-size"
                    htmlFor="defaultCheck3"
                  >
                    KCS VT
                  </label>
                </div>
              </Form.Group>
              <Form.Group
                as={Col}
                md="2"
                controlId="validationCustomUsername13"
              >
                <div className="form-check label">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={selectAll}
                    onChange={() => {
                      setSelectAll(!selectAll);
                      setCheckboxes({
                        defaultCheck1: !selectAll,
                        defaultCheck2: !selectAll,
                        defaultCheck3: !selectAll,
                        defaultCheck4: !selectAll,
                      });
                    }}
                    id="selectAllCheckbox"
                  />
                  <label
                    className="form-check-label font-size"
                    htmlFor="selectAllCheckbox"
                  >
                    Tất cả
                  </label>
                </div>
              </Form.Group>
            </Row>
          </div>

          {/* button */}
          <div className="my-3 add-new d-flex justify-content-between">
            <div className="col-3"></div>
            <div className="group-btn d-flex">
              <div className="search">
                <button
                  className="btn btn-primary label-search"
                  onClick={() => handleSearch()}
                >
                  <AiOutlineSearch className="icon-search" />
                  Search
                </button>
              </div>
              {localStorage.getItem("role") === "ROLE_MANAGER" ||
              localStorage.getItem("role") === "ROLE_ADMIN" ? (
                <>
                  <div className="import">
                    <label
                      htmlFor="test"
                      className="btn btn-danger label-import"
                    >
                      <FaFileImport className="icon-import" />
                      Import
                    </label>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      id="test"
                      hidden
                    />
                  </div>

                  <div className="update update-btn">
                    <NavDropdown
                      title="Update"
                      id="basic-nav-dropdown"
                      className="btn btn-warning nav-drop"
                    >
                      <div className="update-state">
                        <label
                          htmlFor="test1"
                          className="dropdown-item label-state"
                        >
                          Trạng thái sửa chữa
                        </label>
                        <input
                          type="file"
                          id="test1"
                          hidden
                          onChange={handleUploadSC}
                        />
                      </div>
                      <div className="update-state">
                        <label
                          htmlFor="test2"
                          className="dropdown-item label-state"
                        >
                          Xuất kho trả KH
                        </label>
                        <input
                          type="file"
                          id="test2"
                          hidden
                          onChange={handleUploadSC}
                        />
                      </div>
                      <div className="update-state">
                        <label
                          htmlFor="test3"
                          className="dropdown-item label-state"
                        >
                          Trạng thái KCS
                        </label>
                        <input
                          type="file"
                          id="test3"
                          hidden
                          onChange={handleUploadSC}
                        />
                      </div>
                      <div className="update-state">
                        <label
                          htmlFor="test4"
                          className="dropdown-item label-state"
                        >
                          Trạng thái BH
                        </label>
                        <input
                          type="file"
                          id="test4"
                          hidden
                          onChange={handleUploadSC}
                        />
                      </div>
                    </NavDropdown>
                  </div>

                  <div className="update">
                    <button
                      className="btn btn-success label-export"
                      onClick={handleExport}
                      disabled={
                        !checkboxes.defaultCheck1 &&
                        !checkboxes.defaultCheck2 &&
                        !checkboxes.defaultCheck3 &&
                        !checkboxes.defaultCheck4
                      }
                    >
                      <AiOutlineDownload className="icon-export" />
                      Export
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {/* table */}

        <Table striped bordered hover className="table-shadow">
          <thead>
            <tr>
              <th>Stt</th>
              <th>Mã hàng hóa</th>
              <th>Số serial hỏng</th>
              <th>Số PO</th>
              <th>Số BBBG</th>
              <th>Ngày nhập</th>
              <th>Hạng mục</th>
              <th>Trạng thái SC</th>
              <th>Xuất kho trả KH</th>
              <th>KCS VT</th>
              <th>Bảo hành</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {listPoDetail &&
              listPoDetail.length > 0 &&
              listPoDetail.map((item, index) => {
                const currentIndex = startIndex + index;
                const time = item.importDate;
                const timeWarranty = item.warrantyPeriod;
                const dataWarranty = moment(timeWarranty).format("DD/MM/YYYY");
                const data = moment(time).format("DD/MM/YYYY");
                return (
                  <tr
                    key={`sc-${currentIndex}`}
                    onDoubleClick={() => handleShowPoDetail(item)}
                  >
                    <td>{currentIndex + 1}</td>
                    <td>{item.product.productId}</td>
                    <td>{item.serialNumber}</td>
                    <td>{item.po.poNumber}</td>
                    <td>{item.bbbgNumber}</td>
                    <td>{data}</td>
                    <td>
                      {item.repairCategory === 0 && "Nhập kho SC"}
                      {item.repairCategory === 1 && "Nhập kho BH"}
                    </td>
                    <td>
                      {item.repairStatus === 0 && "Sửa chữa không được"}
                      {item.repairStatus === 1 && "Sửa chữa xong"}
                      {item.repairStatus === 2 && "Cháy nổ"}
                    </td>
                    <td>
                      {item.exportPartner === 0 && "Chưa xuất kho"}
                      {item.exportPartner === 1 && "Xuất kho"}
                    </td>
                    <td>
                      {item.kcsVT === 0 && "FAIL"}
                      {item.kcsVT === 1 && "PASS"}
                    </td>
                    <td>{dataWarranty}</td>
                    <td>
                      {localStorage.getItem("role") === "ROLE_MANAGER" ||
                      localStorage.getItem("role") === "ROLE_ADMIN" ? (
                        <button
                          className="btn btn-warning"
                          onClick={() => handleEditPoDetail(item)}
                        >
                          Edit
                        </button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>

        {/* Loading */}

        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <span className="loading">Đang tải...</span>
            </div>
          </div>
        )}

        {/* Phân trang */}

        <div className="d-flex justify-content-end align-items-center">
          <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={totalProducts}
            previousLabel="< previous"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
            renderOnZeroPageCount={null}
          />

          <Form.Select
            aria-label="Default select example"
            className="form-select-size"
            onChange={(event) => setSelectedOption(event.target.value)}
            value={selectedOption}
          >
            <option value="10">10 / Trang</option>
            <option value="25">25 / Trang</option>
            <option value="50">50 / Trang</option>
            <option value="75">75 / Trang</option>
            <option value="100">100 / Trang</option>
          </Form.Select>
        </div>

        {/* Modal */}

        <ModalShowPoDetail
          show={isShowPoDetail}
          handleCloses={handleCloses}
          dateShowPoDetail={dateShowPoDetail}
        />

        <ModalUpdatePoDetail
          show={isShowEditPoDetail}
          handleCloses={handleCloses}
          dateEditPoDetail={dateEditPoDetail}
          getProducts={getProducts}
        />

        <div
          className="modal show "
          style={{ display: "block", position: "initial" }}
        >
          <Modal
            show={isShowNotify}
            onHide={handleCloses}
            size="lg"
            centered
            scrollable
            className="custom-modal"
          >
            <Modal.Header closeButton>
              <Modal.Title className="text-center">Thông báo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Loại lỗi</th>
                    <th>Mã hàng hóa </th>
                    <th>Mô tả lỗi </th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.length > 0 &&
                    data.map((item, index) => {
                      return (
                        <tr key={`sc-${index}`}>
                          <td>{item.type}</td>
                          <td>{item.position}</td>
                          <td>{item.errorDescription}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloses}>
                Close
              </Button>
              <Button variant="primary" onClick={handleExportNotify}>
                Export
              </Button>
            </Modal.Footer>
          </Modal>
        </div>

        <div
          className="modal show"
          style={{ display: "block", position: "initial" }}
        >
          <Modal show={isShowNotifyUpdateSC} onHide={handleCloses} size="lg">
            <Modal.Header closeButton>
              <Modal.Title className="text-center">Thông báo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Mã hàng hóa </th>
                    <th>Mô tả lỗi </th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.length > 0 &&
                    data.map((item, index) => {
                      return (
                        <tr key={`sc-${index}`}>
                          <td>{item.key}</td>
                          <td>{item.errorDescription}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloses}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>

        <div
          className="modal show"
          style={{ display: "block", position: "initial" }}
        >
          <Modal show={isShowNotifyUpdateXK} onHide={handleCloses} size="lg">
            <Modal.Header closeButton>
              <Modal.Title className="text-center">Thông báo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Mã hàng hóa </th>
                    <th>Mô tả lỗi </th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.length > 0 &&
                    data.map((item, index) => {
                      return (
                        <tr key={`sc-${index}`}>
                          <td>{item.key}</td>
                          <td>{item.errorDescription}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloses}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>

        <div
          className="modal show"
          style={{ display: "block", position: "initial" }}
        >
          <Modal show={isShowNotifyUpdateKCS} onHide={handleCloses} size="lg">
            <Modal.Header closeButton>
              <Modal.Title className="text-center">Thông báo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Mã hàng hóa </th>
                    <th>Mô tả lỗi </th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.length > 0 &&
                    data.map((item, index) => {
                      return (
                        <tr key={`sc-${index}`}>
                          <td>{item.key}</td>
                          <td>{item.errorDescription}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloses}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>

        <div
          className="modal show"
          style={{ display: "block", position: "initial" }}
        >
          <Modal show={isShowNotifyUpdateBH} onHide={handleCloses} size="lg">
            <Modal.Header closeButton>
              <Modal.Title className="text-center">Thông báo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Mã hàng hóa </th>
                    <th>Mô tả lỗi </th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.length > 0 &&
                    data.map((item, index) => {
                      return (
                        <tr key={`sc-${index}`}>
                          <td>{item.key}</td>
                          <td>{item.errorDescription}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloses}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </>
  );
};
