import {
  DeleteOutlined,
  EyeOutlined,
  LogoutOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Col, Image, Result, Row, Select, Table, Upload } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ReviewStatusOQC = () => {
  const [masterCartonList, setMasterCartonList] = useState([]);
  const [Activekey, setActivekey] = useState(0);
  const { Option } = Select;
  const selector = useSelector((state) => state.persistedReducer);

  useEffect(() => {
    getMasterCartons();
  }, []);

  const props = {
    name: "image",
    action: `${process.env.REACT_APP_API_URL}/uploadTestingImages`,
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        updateFileImage(info.file.response, Activekey);
      } else if (info.file.status === "error") {
        // message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const getMasterCartons = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getItemsForReview")
      .then((result) => {
        let newArr = [];
        result.data.map((x) => {
          newArr.push({
            batch: x.batch,
            line: x.line,
            master_carton: x.master_carton,
            defect_list_name: x.defect_list_name,
            imei: x.imei,
            oqcl: x.oqcl,
            pictures: x.pictures,
            defect_category: x.defect_category,
            remarks: x.remarks,
          });
        });

        setMasterCartonList(newArr);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = (id) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/deleteMasterCarton", { id })
      .then((result) => {
        // console.log(result.data);
        getMasterCartons();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateDefect = (value, key) => {
    let arr = masterCartonList;
    arr.map((x) => {
      if (x.id === key) {
        x.defect_category.default = value;
      }
    });
    setMasterCartonList(arr);
  };

  const updateFileImage = (name, key) => {
    let arr = masterCartonList;
    arr.map((x) => {
      if (x.id === key) {
        x.pictures.default = name;
      }
    });
    setMasterCartonList(arr);
  };

  const columns = [
    {
      title: "Batch Number",
      dataIndex: "batch",
      key: "batch",
    },
    {
      title: "Line Number",
      dataIndex: "line",
      key: "line",
    },
    {
      title: "Master Carton",
      dataIndex: "master_carton",
      key: "master_carton",
    },
    {
      title: "Defected list Name",
      dataIndex: "defect_list_name",
      key: "defect_list_name",
    },
    {
      title: "IMEI Code",
      dataIndex: "imei",
      key: "imei",
    },
    {
      title: "Outgoing Quality Check list",
      dataIndex: "oqcl",
      key: "oqcl",
    },

    {
      title: "Defect Category",
      dataIndex: "defect_category",
      key: "defect_category",
      render: (defect) => {
        // console.log(defect);
        return (
          <Select
            disabled
            placeholder="Select Any Defect"
            allowClear
            style={{ minWidth: "150px", textAlign: "center" }}
            defaultValue={defect}
          >
            <Option value="1">Select Any Defect</Option>
            <Option value="2">Functional</Option>
            <Option value="3">Aesthetic</Option>
            <Option value="4">Missing category</Option>
            <Option value="5">Other</Option>
          </Select>
        );
      },
    },
    {
      title: "Pictures",
      dataIndex: "pictures",
      key: "pictures",
      render: (data) => {
        console.log(data);
        return (
          <div style={{ paddingRight: "20px", textAlign: "center" }}>
            {/* <Upload
              {...props}
              maxCount={1}
              onClick={() => setActivekey(data.key)}
            >
              <Button icon={<UploadOutlined />}>Upload image</Button>
            </Upload> */}
            <Image
              width={70}
              height={70}
              style={{ borderRadius: "50%" }}
              src={`${process.env.REACT_APP_API_URL}/testingImages/${data}`}
            />
            {/* <EyeOutlined /> */}
          </div>
        );
      },
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
    },
  ];

  return (
    <div>
      <Row style={{ alignItems: "center" }}>
        <Col span={11}>
          <span className="TopMenuTxt">Review Status</span>
        </Col>
        <Col span={6}></Col>
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
              scroll={{
                x: 1300,
              }}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ReviewStatusOQC;
