import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  Result,
  Modal,
  Spin,
  Form,
  message,
  Input,
} from "antd";
import {
  DownloadOutlined,
  LogoutOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  ActiveBatch,
  logoutActiveLine,
  saveActiveLine,
} from "../../../Redux/Actions";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
const MasterCartonBatchList_qc = () => {
  const [LineModel, setLineModel] = useState(false);
  const [BatchModel, setBatchModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dummyState, setdummyState] = useState(false);
  const [LineLogedIn, setLineLogedIn] = useState(false);
  const [LineSelectedName, setLineLineSelectedName] = useState("");
  const [LineSelectedTime, setLineSelectedTime] = useState(false);
  const [BatchName, setBatchName] = useState("");
  const [BatchList, setBatchList] = useState([]);

  const [LineNumbers, setLineNumbers] = useState([
    {
      id: 1,
      name: "Line number 1,2",
      active: false,
    },
    {
      id: 2,
      name: "Line number 3,4",
      active: false,
    },
    {
      id: 3,
      name: "Line number 5,6",
      active: false,
    },
    {
      id: 4,
      name: "Line number 7,8",
      active: false,
    },
  ]);

  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const selector = useSelector((state) => state.persistedReducer);
  const navigate = useNavigate();

  useEffect(() => {
    checkLineActive();
    GetBatchAllData();
    getBatch();
  }, []);

  const checkLineActive = () => {
    setLineLogedIn(selector.LineLogin.isLogedIn);
    setLineLineSelectedName(selector.LineLogin.line_name);
    setLineSelectedTime(new Date(selector.LineLogin.line_login_time));

    if (selector.LineLogin.isLogedIn == true) {
      getBatch(selector.LineLogin.line_name);
    }
  };

  const ShowtLineNumber = () => {
    showLineModel();
  };

  const showLineModel = () => {
    setLineModel(true);
  };
  const lineModelCancel = () => {
    setLineModel(false);
  };

  const showBatchModel = () => {
    setBatchModel(true);
  };
  const BatchModelCancel = () => {
    setBatchModel(false);
  };

  const selectLineNumber = (id = null) => {
    let lines = LineNumbers;

    LineNumbers.map((x) => {
      if (x.id == id) {
        x.active = true;
      } else {
        x.active = false;
      }
    });

    setLineNumbers(lines);
    setdummyState(!dummyState);
  };

  const handleSaveLineNumber = () => {
    let activeTime = new Date();
    setLineSelectedTime(activeTime);

    LineNumbers.map((x) => {
      if (x.active) {
        setLineLineSelectedName(x.name);
        let logObj = {
          user_id: selector.user.token,
          isLogedIn: true,
          line_name: x.name,
          line_login_time: activeTime,
          type: "OQC",
        };

        axios
          .post(process.env.REACT_APP_API_URL + "/LoginLine", logObj)
          .then((result) => {
            console.log(result.data);
            logObj.line_id = result.data._id;
            dispatch(saveActiveLine(logObj));
            getBatch(x.name);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });

    setLineLogedIn(true);
    lineModelCancel();
  };

  const handleLineLogout = () => {
    setLineLogedIn(false);
    let logObj = {
      id: selector.LineLogin.line_id,
      time: new Date(),
    };
    axios
      .post(process.env.REACT_APP_API_URL + "/LogoutLine", logObj)
      .then((result) => {
        console.log(result.data);
        dispatch(logoutActiveLine());
        getBatch("");
      })
      .catch((err) => {
        console.log(err);
      });
    selectLineNumber();
  };

  const handleCreateBatchModal = () => {
    let batchName = `Batch_${new Date().getTime()}`;
    setBatchName(batchName);
    showBatchModel();
  };

  const handleCreateBatch = () => {
    let batchObj = {
      batch_name: BatchName,
      line_name: LineSelectedName,
      type: "OQC",
      total_no: 0,
    };

    axios
      .post(process.env.REACT_APP_API_URL + "/saveBatch", batchObj)
      .then((result) => {
        getBatch(LineSelectedName);
        BatchModelCancel();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [BatchListData, setGetBatchlist] = useState("");

  const GetBatchAllData = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/getBatchforExcel", {})
      .then((result) => {
        let newArr = [];
        result.data.map((x) => {
          newArr.push({
            batch: x.batch_name,
            line: x.line_name,
            Username: x.username,
            Number_of_Master_Carton_Added: x.total_no,
            createdAt: x.createdAt,
            updatedAt: x.updatedAt,
          });
        });

        setGetBatchlist(newArr);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getBatch = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/getBatchQH", {})
      .then((result) => {
        setBatchList(result.data);
        let newArr = [];
        result.data.map((x) => {
          newArr.push({
            batch: x.batch_name,
            line: x.line_name,
            user_id: x.user_id,
            Number_of_Master_Carton_Added: x.total_no,
            createdAt: x.createdAt,
            updatedAt: x.updatedAt,
          });
        });

        setGetBatchlist(newArr);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const AddMasterCarton = (name) => {
    dispatch(
      ActiveBatch({
        name,
      })
    );
    navigate("/AddMasterCartonOQC");
  };

  const DeleteBatch = (id) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/deletBatch", {
        id,
      })
      .then((result) => {
        getBatch(LineSelectedName);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleExcelImport = () => {
    // Create a workbook
    const wb = XLSX.utils.book_new();

    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    };
    const formattedBatchList = BatchListData.map((item) => {
      const { createdAt, updatedAt, ...rest } = item;
      return {
        ...rest,
        DateTime: new Date(item.createdAt).toLocaleString(),
        UpdatedDateTime: new Date(item.updatedAt).toLocaleString(),
      };
    });

    const ws = XLSX.utils.json_to_sheet(formattedBatchList);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Generate a download link for the workbook
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);

    // Create a link and trigger a click to download the file
    const a = document.createElement("a");
    a.href = url;
    a.download = "Checked_data_list.xlsx";
    a.click();
  };

  return (
    <div>
      <Modal open={BatchModel} onCancel={BatchModelCancel} footer={[]}>
        <Spin spinning={loading}>
          {contextHolder}
          <div style={{ padding: "30px" }}>
            <Row>
              <Col span={24} style={{ marginBottom: "30px" }}>
                <span className="popupTitle">Batch Number</span>
              </Col>
              <Col
                span={24}
                style={{ textAlign: "center", padding: "0rem 3rem 1rem" }}
              >
                <img src="./SVG/check.svg" />
              </Col>
              <Col span={24} style={{ padding: "5px 3rem" }}>
                Batch Created successfully with Batch Number:
              </Col>
              <Col span={24} style={{ padding: "5px 3rem" }}>
                {BatchName}
              </Col>
              <Col span={24} style={{ padding: "2rem  3rem 0" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
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
                      onClick={() => handleCreateBatch()}
                    >
                      OK
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Spin>
      </Modal>
      <Modal open={LineModel} onCancel={lineModelCancel} footer={[]}>
        <Spin spinning={loading}>
          {contextHolder}
          <div style={{ padding: "30px" }}>
            <Row>
              <Col span={24} style={{ marginBottom: "30px" }}>
                <span className="popupTitle">Select Line Number</span>
              </Col>
              <Col span={24}>
                <Row gutter={[20, 20]}>
                  {LineNumbers.map((x) => {
                    return (
                      <Col className="lineModalCol" span={12}>
                        <Button
                          className={
                            x.active == true
                              ? "lineModalButton lineModalButtonActive"
                              : "lineModalButton"
                          }
                          onClick={() => selectLineNumber(x.id)}
                        >
                          {x.name}
                        </Button>
                      </Col>
                    );
                  })}

                  <Col
                    className="lineModalCol"
                    span={24}
                    style={{
                      marginTop: "1rem",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          color: "#606060",
                        }}
                      ></span>
                      Line Login time:
                      <Input
                        style={{
                          width: "25%",
                          height: "30px",
                          borderRadius: 0,
                          margin: "0 7px",
                          textAlign: "center",
                        }}
                        value={new Date().toLocaleTimeString()}
                        readOnly
                      />
                    </div>
                  </Col>
                  <Col className="lineModalCol" span={24}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "1rem",
                      }}
                    >
                      <Button
                        className="lineModalButtonSUbmit"
                        onClick={() => handleSaveLineNumber()}
                      >
                        OK
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Spin>
      </Modal>
      <Row style={{ alignItems: "center" }}>
        <Col span={12}>
          <span className="TopMenuTxt">Master Carton Batches checked list</span>
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          <span className="TopMenuTxt" style={{ marginRight: "15px" }}>
            <Button
              key="excelImport"
              type="primary"
              onClick={handleExcelImport}
              style={{ marginRight: "15px" }}
            >
              Import Report <DownloadOutlined />
            </Button>
          </span>
        </Col>
      </Row>
      <Row style={{ marginTop: "2rem" }}>
        <Col span={24} style={{ backgroundColor: "#fff" }}>
          {BatchList.length === 0 ? (
            <Result
              icon={<img src="./SVG/noitem.svg" />}
              subTitle="No Item Found"
            />
          ) : (
            BatchList.map((x) => {
              console.log(x);
              return (
                <div style={{ padding: "1rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "#606060",
                      fontSize: "14px",
                      fontWeight: "400",
                    }}
                  >
                    <div>
                      <div>Batch ID: {x.batch_name}</div>
                      <div>Number of Master Carton Added: {x.total_no} </div>
                      <div>
                        Date - {new Date(x.createdAt).toLocaleDateString()}
                      </div>
                      <div>{x.line_name}</div>
                    </div>
                    <div>
                      <div style={{ display: "flex" }}>
                        <div style={{ margin: "0 10px" }}>
                          <Button
                            className="lineModalButtonSUbmit"
                            style={{ width: "unset" }}
                            onClick={() => navigate("/EmployeeLoginList_qh")}
                          >
                            Employee login deatails
                          </Button>
                        </div>
                        <div>
                          <Button
                            className="lineModalButtonSUbmit"
                            style={{ width: "unset" }}
                            onClick={() => navigate("/ReviewStatusOQC")}
                          >
                            Review
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </Col>
      </Row>
    </div>
  );
};

export default MasterCartonBatchList_qc;
