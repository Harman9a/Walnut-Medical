import {
  DeleteOutlined,
  LogoutOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import { Button, Col, Input, Modal, Result, Row, Table, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ShowMonoCartonSandeeModal from "./Modals/ShowMonoCartonSandeeModal";
import { useNavigate } from "react-router-dom";
import { QrReader } from "react-qr-reader";

const AddMasterCartonOQC = () => {
  const [masterCartonList, setMasterCartonList] = useState([]);
  const [MonoCartonList, setMonoCartonList] = useState([]);
  const [foundDataModal, setFoundDataModal] = useState(false);
  const [showViewCartonModal, setShowViewCartonModal] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const [startScan, setStartScan] = useState(false);

  const [masterCartonNumber, setMasterCartonNumber] = useState("");
  const [dataFound, setDataFound] = useState({
    mono_carton: 0,
    sandee: 0,
  });

  const [dataFoundDetails, setDataFoundDetails] = useState([]);
  const [foundDataDetails, setFoundDataDetails] = useState(false);

  const selector = useSelector((state) => state.persistedReducer);

  useEffect(() => {
    getMasterCartons();
  }, []);

  const getMasterCartons = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/getMasterCarton", {
        batch_name: selector.LineLogin.active_batch,
      })
      .then((result) => {
        let newArr = [];
        result.data.map((x) => {
          newArr.push({
            mcn: x.masterCartonNumber,
            status: x.check_status === "true" ? "Checked" : "Unchecked",
            iicf: "Found",
            vic: x.details,
            tmc: x._id,
            action: x._id,
          });
        });

        setMasterCartonList(newArr);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleScanQR = (data) => {
    setStartScan(!startScan);
    messageApi.open({
      type: "success",
      content: "Scanned  Successfully",
    });

    data = data.split(",");

    data = data.filter((x) => x != "");

    let master_carton_no = data.length - 2;

    let dataObj = {
      mono_carton: master_carton_no,
      sandee: 2,
    };

    let dataObjDetails = [
      {
        mono_carton: [],
        standee: [],
      },
    ];

    let standee_sr = 1;

    data.map((x, i) => {
      if (i < master_carton_no) {
        dataObjDetails[0].mono_carton.push({
          id: i + 1,
          imei: x,
          defect: 0,
        });
      } else {
        dataObjDetails[0].standee.push({
          id: standee_sr,
          imei: x,
          defect: 0,
        });
        standee_sr++;
      }
    });

    gotDataFromQR(dataObj, dataObjDetails);
  };

  const handleScanQRError = (err) => {
    setStartScan(!startScan);
    messageApi.open({
      type: "error",
      content: "device not found",
    });

    console.log(err);

    let data =
      "864180051473820,864180051434947,864180051518517,864180051439078,864180051489982,864180051470289,864180051434442,864180051513567,864180051502917,864180051517246,864180051484413,864180051448095,864180051503055,864180051469893,864180051518541,864180051435118,864180051427552,864180051462401,864180051496169,864180051513781,8920230624080041,8920230624074141,";
    data = data.split(",");

    data = data.filter((x) => x != "");

    let master_carton_no = data.length - 2;

    let dataObj = {
      mono_carton: master_carton_no,
      sandee: 2,
    };

    let dataObjDetails = [
      {
        mono_carton: [],
        standee: [],
      },
    ];

    let standee_sr = 1;

    data.map((x, i) => {
      if (i < master_carton_no) {
        dataObjDetails[0].mono_carton.push({
          id: i + 1,
          imei: x,
          defect: 0,
        });
      } else {
        dataObjDetails[0].standee.push({
          id: standee_sr,
          imei: x,
          defect: 0,
        });
        standee_sr++;
      }
    });

    console.log(dataObjDetails);

    gotDataFromQR(dataObj, dataObjDetails);
  };

  const gotDataFromQR = (data, details) => {
    setDataFound(data);
    setDataFoundDetails(details);
    showFoundDataModal();
  };

  const showFoundDataModal = () => {
    setFoundDataModal(true);
  };

  const BatchModelCancel = () => {
    setFoundDataModal(false);
  };

  const handleCreateDataFound = () => {
    setFoundDataDetails(true);
    BatchModelCancel();
  };

  const handleMasterCatronAdd = () => {
    let masterCartonObj = {
      batch_name: selector.LineLogin.active_batch,
      mono_carton: dataFound.mono_carton,
      sandee: dataFound.sandee,
      masterCartonNumber,
      details: dataFoundDetails,
      total_no: masterCartonList.length + 1,
      user_id: selector.user.employee_id,
    };

    axios
      .post(process.env.REACT_APP_API_URL + "/AddMasterCarton", masterCartonObj)
      .then((result) => {
        console.log(result.data);

        setFoundDataDetails(false);
        setDataFound({
          mono_carton: 0,
          sandee: 0,
        });
        setMasterCartonNumber("");
        getMasterCartons();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = (id) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/deleteMasterCarton", { id })
      .then((result) => {
        console.log(result.data);
        getMasterCartons();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleViewCarton = (data) => {
    setMonoCartonList(data);
    setShowViewCartonModal(true);
  };

  const handleViewCartonCancel = () => {
    setShowViewCartonModal(false);
  };

  const StartTesting = (id) => {
    masterCartonList.map((x) => {
      if (x.action === id) {
        navigate(`/SondBoxOQCList/${x.mcn}`);
      }
    });
  };

  const columns = [
    {
      title: "Master Carton Number",
      dataIndex: "mcn",
      key: "mcn",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Items IMEI code Found",
      dataIndex: "iicf",
      key: "iicf",
    },
    {
      title: "View IMEI code",
      dataIndex: "vic",
      key: "vic",
      render: (record) => (
        <Button
          className="lineModalButtonSUbmit"
          onClick={() => handleViewCarton(record)}
        >
          View
        </Button>
      ),
    },
    {
      title: "Test Master Carton",
      dataIndex: "tmc",
      key: "tmc",
      render: (record) => {
        return (
          <Button
            className="lineModalButtonSUbmit"
            onClick={() => StartTesting(record)}
          >
            Start Testing
          </Button>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (id) => (
        <DeleteOutlined
          onClick={() => handleDelete(id)}
          style={{ fontSize: "14px", color: "red" }}
        />
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      {startScan && (
        <>
          <div>
            <div
              style={{
                width: "300px",
              }}
            >
              <QrReader
                constraints={{
                  facingMode: "environment",
                }}
                onResult={(result, error) => {
                  if (!!result) {
                    handleScanQR(result.text);
                  }

                  if (!!error) {
                    // messageApi.open({
                    //   type: "error",
                    //   content: "device not found",
                    // });
                    console.log(error);
                    // handleScanQRError();
                  }
                }}
              />
            </div>
            <Button onClick={() => setStartScan(!startScan)}>close</Button>
          </div>
        </>
      )}
      <ShowMonoCartonSandeeModal
        MonoCartonList={MonoCartonList}
        showViewCartonModal={showViewCartonModal}
        handleViewCartonCancel={() => handleViewCartonCancel()}
      />
      <Modal open={foundDataModal} onCancel={BatchModelCancel} footer={[]}>
        <div style={{ padding: "30px" }}>
          <Row>
            <Col span={24} style={{ marginBottom: "30px" }}>
              <span className="popupTitle">Master Carton Items</span>
            </Col>
            <Col
              span={24}
              style={{ textAlign: "center", padding: "0rem 3rem 1rem" }}
            >
              <img src="./SVG/check.svg" />
            </Col>
            <Col span={24} style={{ textAlign: "center" }}>
              Mater Carton found {dataFound.mono_carton} Mono Carton and{" "}
              {dataFound.sandee} Sandee IMEI code
            </Col>
            <Col span={24} style={{ textAlign: "center", marginTop: "10px" }}>
              successfully on scanning!
            </Col>
            <Col span={24} style={{ padding: "2rem  3rem 0" }}>
              <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                <div>
                  <Button
                    className="lineModalButtonSUbmit2"
                    onClick={() => BatchModelCancel()}
                  >
                    Cancel
                  </Button>
                </div>
                <div>
                  <Button
                    className="lineModalButtonSUbmit"
                    onClick={() => handleCreateDataFound()}
                  >
                    OK
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Modal>
      <Row style={{ alignItems: "center" }}>
        <Col span={11}>
          <span className="TopMenuTxt">Add Master Carton</span>
        </Col>
        <Col span={6}>
          <span style={{ margin: "0 7px" }}>
            <span style={{ fontWeight: "600", marginRight: "10px" }}>
              Batch ID:
            </span>
            <span style={{ fontWeight: "400" }}>
              {selector.LineLogin.active_batch}
            </span>
          </span>
        </Col>
        <Col span={7} style={{ textAlign: "right" }}>
          <span style={{ margin: "0 7px" }}>
            <Button
              type="text"
              style={{ backgroundColor: "#fff" }}
              className="topLogoutBtn"
            >
              {selector.LineLogin.line_name} (
              {new Date(
                selector.LineLogin.line_login_time
              ).toLocaleTimeString()}
              )
              <LogoutOutlined style={{ color: "red" }} />
            </Button>
          </span>
        </Col>
      </Row>
      <Row
        style={{ marginTop: "2rem", backgroundColor: "#fff", padding: "1rem" }}
      >
        <Col span={24}>
          <div style={{ display: "flex" }}>
            <div>
              <div style={{ marginBottom: "15px" }}>
                Please Scan Mater Carton BR Code
              </div>
              <div>
                <Button
                  className="masterCartonAddButton"
                  onClick={() => setStartScan(!startScan)}
                >
                  Outgoing Quality Check <QrcodeOutlined />
                </Button>
              </div>
              {foundDataDetails === true ? (
                <div style={{ color: "#606060", fontSize: "12px" }}>
                  <div style={{ marginTop: "5px" }}>
                    Mater Carton found {dataFound.mono_carton} Mono Carton and{" "}
                    {dataFound.sandee} Sandee IMEI code
                  </div>
                  <div style={{ marginTop: "2px" }}>
                    successfully on scanning!
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            <div style={{ marginLeft: "30px" }}>
              <div style={{ marginBottom: "15px" }}>Master Carton Number</div>
              <div>
                <Input
                  className="masterCartonAddInput"
                  placeholder="Please Enter Master Carton Number"
                  onChange={(e) => setMasterCartonNumber(e.target.value)}
                  value={masterCartonNumber}
                />
              </div>
            </div>
          </div>
        </Col>
        <Col span={24}>
          <div style={{ marginTop: "40px" }}>
            <Button
              className="lineModalButtonSUbmit"
              onClick={() => handleMasterCatronAdd()}
            >
              Save
            </Button>
          </div>
        </Col>
      </Row>
      <Row
        style={{ marginTop: "2rem", backgroundColor: "#fff", padding: "1rem" }}
      >
        <Col span={24}>
          {masterCartonList.length === 0 ? (
            <Result
              icon={<img src="./SVG/noitem.svg" />}
              subTitle="No Item Found"
            />
          ) : (
            <Table
              style={{ textAlign: "center" }}
              columns={columns}
              dataSource={masterCartonList}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default AddMasterCartonOQC;
