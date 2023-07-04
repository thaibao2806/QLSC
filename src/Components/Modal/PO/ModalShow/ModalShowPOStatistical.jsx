import React, { useEffect, useRef, useState } from "react";
import "./modalstatistical.scss";
import { Modal, Table } from "react-bootstrap";
import { Chart } from "chart.js/auto";
import { showStatistical } from "../../../../service/service";

const ModalShowPOStatistical = (props) => {
  const { show, handleClose, dataStatistical } = props;
  const [listPo, setListPo] = useState("");
  const chartRef = useRef(null);
  const chartRefXK = useRef(null);
  const chartRefKCS = useRef(null);
  const chartRefBH = useRef(null);
  let myChartSC = null;
  let myChartXK = null;
  let myChartKCS = null;
  let myChartBH = null;

  useEffect(() => {
    if (show) {
      handleShow();
    }
  }, [dataStatistical]);

  useEffect(() => {
    if (listPo) {
      createOrUpdateChartSC();
      createOrUpdateChartXK();
      createOrUpdateChartKCS();
      createOrUpdateChartBH();
    }
  }, [listPo]);

  const createOrUpdateChartSC = () => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      if (myChartSC) {
        myChartSC.destroy();
      }

      myChartSC = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["SC xong", "SC không được", "Chưa cập nhật", "Cháy nổ"],
          datasets: [
            {
              data: [
                listPo.TRANG_THAI_SC.SC_XONG,
                listPo.TRANG_THAI_SC.SC_KHONG_DUOC,
                listPo.TRANG_THAI_SC.CHUA_CAP_NHAT,
                listPo.TRANG_THAI_SC.CHAY_NO,
              ],
              backgroundColor: [
                "rgba(255, 0, 0, 0.5)",
                "rgba(100, 255, 0, 0.5)",
                "rgba(200, 50, 255, 0.5)",
                "rgba(0, 100, 255, 0.5)",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          title: {
            display: true,
            text: "Weather",
          },
        },
      });
    }
  };

  const createOrUpdateChartXK = () => {
    if (chartRefXK.current) {
      const ctx = chartRefXK.current.getContext("2d");

      if (myChartXK) {
        myChartXK.destroy();
      }

      myChartXK = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Không XK", "Đã XK", "Chưa cập nhật"],
          datasets: [
            {
              data: [
                listPo.XUAT_KHO.KHONG_XUAT_KHO,
                listPo.XUAT_KHO.DA_XUAT_KHO,
                listPo.XUAT_KHO.CHUA_CAP_NHAT,
              ],
              backgroundColor: [
                "rgba(255, 0, 0, 0.5)",
                "rgba(100, 255, 0, 0.5)",
                "rgba(200, 50, 255, 0.5)",
                "rgba(0, 100, 255, 0.5)",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          title: {
            display: true,
            text: "Weather",
          },
        },
      });
    }
  };

  const createOrUpdateChartKCS = () => {
    if (chartRefKCS.current) {
      const ctx = chartRefKCS.current.getContext("2d");

      if (myChartKCS) {
        myChartKCS.destroy();
      }

      myChartKCS = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["PASS", "FAIL", "Chưa cập nhật"],
          datasets: [
            {
              data: [
                listPo.KSC_VT.PASS,
                listPo.KSC_VT.FAIL,
                listPo.KSC_VT.CHUA_CAP_NHAT,
              ],
              backgroundColor: [
                "rgba(255, 0, 0, 0.5)",
                "rgba(100, 255, 0, 0.5)",
                "rgba(200, 50, 255, 0.5)",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          title: {
            display: true,
            text: "Weather",
          },
        },
      });
    }
  };

  const createOrUpdateChartBH = () => {
    if (chartRefBH.current) {
      const ctx = chartRefBH.current.getContext("2d");

      if (myChartBH) {
        myChartBH.destroy();
      }

      myChartBH = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Đã cập nhật", "Chưa cập nhật"],
          datasets: [
            {
              data: [
                listPo.BAO_HANH.DA_CAP_NHAT,
                listPo.BAO_HANH.CHUA_CAP_NHAT,
              ],
              backgroundColor: [
                "rgba(255, 0, 0, 0.5)",
                "rgba(100, 255, 0, 0.5)",
                "rgba(200, 50, 255, 0.5)",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          title: {
            display: true,
            text: "Weather",
          },
        },
      });
    }
  };
  const handleShow = async () => {
    let res = await showStatistical(dataStatistical.poNumber);
    if (res && res.statusCode === 200) {
      setListPo(res.data);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} fullscreen size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Thống kê PO</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <h5 className="table-sum">Trạng thái sửa chữa</h5>
            <div className="statistical-sc">
              <Table striped bordered hover size="sm" className="table-sc">
                <thead>
                  <tr>
                    <th>Sửa chữa xong</th>
                    <th>Sữa chữa không được</th>
                    <th>Chưa cập nhật</th>
                    <th>Cháy nổ</th>
                  </tr>
                </thead>
                <tbody>
                  {listPo && Object.keys(listPo).length > 0 && (
                    <tr>
                      <td>{listPo.TRANG_THAI_SC.SC_XONG}</td>
                      <td>{listPo.TRANG_THAI_SC.SC_KHONG_DUOC}</td>
                      <td>{listPo.TRANG_THAI_SC.CHUA_CAP_NHAT}</td>
                      <td>{listPo.TRANG_THAI_SC.CHAY_NO}</td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <div className="card">
                <div className="card-body" style={{ height: "200px" }}>
                  <canvas ref={chartRef} />
                </div>
              </div>
            </div>
          </div>
          <div>
            <h5 className="table-sum">Xuất kho</h5>
            <div className="statistical-sc">
              <Table striped bordered hover size="sm" className="table-sc">
                <thead>
                  <tr>
                    <th>Không xuất kho</th>
                    <th>Đã xuất kho</th>
                    <th>Chưa cập nhật</th>
                  </tr>
                </thead>
                <tbody>
                  {listPo && Object.keys(listPo).length > 0 && (
                    <tr>
                      <td>{listPo.XUAT_KHO.KHONG_XUAT_KHO}</td>
                      <td>{listPo.XUAT_KHO.DA_XUAT_KHO}</td>
                      <td>{listPo.XUAT_KHO.CHUA_CAP_NHAT}</td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <div className="card">
                <div className="card-body" style={{ height: "200px" }}>
                  <canvas ref={chartRefXK} />
                </div>
              </div>
            </div>
          </div>
          <div>
            <h5 className="table-sum">KCS</h5>
            <div className="statistical-sc">
              <Table striped bordered hover size="sm" className="table-sc">
                <thead>
                  <tr>
                    <th>PASS</th>
                    <th>FAIL</th>
                    <th>Chưa cập nhật</th>
                  </tr>
                </thead>
                <tbody>
                  {listPo &&
                    Object.keys(listPo).length > 0 && ( 
                      <tr>
                        <td>{listPo.KSC_VT.PASS}</td>
                        <td>{listPo.KSC_VT.FAIL}</td>
                        <td>{listPo.KSC_VT.CHUA_CAP_NHAT}</td>
                      </tr>
                    )}
                </tbody>
              </Table>
              <div className="card">
                <div className="card-body" style={{ height: "200px" }}>
                  <canvas ref={chartRefKCS} />
                </div>
              </div>
            </div>
            <div>
              <h5 className="table-sum">Bảo hành</h5>
              <div className="statistical-sc">
                <Table striped bordered hover size="sm" className="table-sc">
                  <thead>
                    <tr>
                      <th>Đã cập nhật</th>
                      <th>Chưa câp nhật</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listPo &&
                      Object.keys(listPo).length > 0 && ( 
                        <tr>
                          <td>{listPo.BAO_HANH.DA_CAP_NHAT}</td>
                          <td>{listPo.BAO_HANH.CHUA_CAP_NHAT}</td>
                        </tr>
                      )}
                  </tbody>
                </Table>
                <div className="card">
                  <div className="card-body" style={{ height: "200px" }}>
                    <canvas ref={chartRefBH} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h5 className="table-sum header-tb">Tổng số lượng</h5>

            <Table striped bordered hover size="sm" className="table-sum">
              <thead>
                <tr>
                  <th>Tổng</th>
                  <th>Số lượng import</th>
                </tr>
              </thead>
              <tbody>
                {listPo &&
                  Object.keys(listPo).length > 0 && ( 
                    <tr>
                      <td>{listPo.TONG_SO_LUONG.TONG}</td>
                      <td>{listPo.TONG_SO_LUONG.SO_LUONG_IMPORT}</td>
                    </tr>
                  )}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalShowPOStatistical;
