import { LogoutOutlined } from "@ant-design/icons";
import { Button, Col, Collapse, Row } from "antd";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MasterCartonListOQC from "./OQCTestList/MasterCartonListOQC";
import BoxItemCheckOQC from "./OQCTestList/BoxItemCheckOQC";
import axios from "axios";
import MonoCartonCheckList from "./OQCTestList/MonoCartonCheckList";
import SandeeSingleTesting from "./OQCTestList/SandeeSingleTesting";
import CheckForSampleOQC from "./OQCTestList/CheckForSampleOQC";
import MatchDeviceAndBoxIMEIOQC from "./OQCTestList/MatchDeviceAndBoxIMEIOQC";

const ListSturcture = ({ name, component }) => {
  return (
    <Row style={{ marginTop: "2rem", backgroundColor: "#fff" }}>
      <Col span={24}>
        <div>
          <Collapse
            expandIconPosition={"end"}
            bordered={false}
            style={{
              background: "#fff",
            }}
            items={[
              {
                key: "1",
                label: name,
                children: component,
              },
            ]}
          />
        </div>
      </Col>
    </Row>
  );
};

const SondBoxOQCList = () => {
  const [IMEICode, setIMEICode] = useState();
  const selector = useSelector((state) => state.persistedReducer);
  const parms = useParams();
  const [dataList2, setDataList2] = useState([]);
  const [showSaveCheckButton, setShowSaveCheckButton] = useState(false);

  useEffect(() => {
    setIMEICode(parms.imei);
    getData(parms.imei);
  }, []);

  const getData = (code) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/getMasterCartonIMEI", {
        imei: code,
      })
      .then((result) => {
        let data = result.data;
        if (data.length !== 0) {
          if (data[0].check_status === undefined) {
            setShowSaveCheckButton(true);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });

    let dataObj = {
      mc_imei_code: code,
    };

    axios
      .post(process.env.REACT_APP_API_URL + "/getOQCTest", dataObj)
      .then((result) => {
        if (result.data.length !== 0) {
          setDataList2(result.data[0]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const sendToCheck = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/marked-checked", {
        imei: IMEICode,
      })
      .then((result) => {
        console.log(result.data);
        setShowSaveCheckButton(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Row style={{ alignItems: "center" }}>
        <Col span={10}>
          <span className="TopMenuTxt">
            Sound Box Outgoing Quality Check list
          </span>
        </Col>
        <Col span={7}>
          <span style={{ margin: "0 7px" }}>
            <span style={{ fontWeight: "600", marginRight: "10px" }}>
              Master Carton IMEI No. :
            </span>
            <span style={{ fontWeight: "400" }}>{IMEICode}</span>
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
      <ListSturcture
        name="Master Carton Check List"
        component={
          <MasterCartonListOQC IMEICode={IMEICode} dataList2={dataList2} />
        }
      />
      <ListSturcture
        name="Box Items check"
        component={
          <BoxItemCheckOQC dataList2={dataList2} IMEICode={IMEICode} />
        }
      />
      <ListSturcture
        name="Mono Carton Check List"
        component={
          <MonoCartonCheckList dataList2={dataList2} IMEICode={IMEICode} />
        }
      />
      <ListSturcture
        name="Standee Box check List"
        component={
          <SandeeSingleTesting dataList2={dataList2} IMEICode={IMEICode} />
        }
      />
      {/* <ListSturcture
        name="Check for Sample"
        component={
          <CheckForSampleOQC dataList2={dataList2} IMEICode={IMEICode} />
        }
      /> */}
      <ListSturcture
        name="Match device and box IMEI no on barcode sticker"
        component={
          <MatchDeviceAndBoxIMEIOQC dataList2={dataList2} IMEICode={IMEICode} />
        }
      />
      {showSaveCheckButton === true ? (
        <>
          <div
            style={{
              padding: "1rem 0",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              onClick={() => sendToCheck()}
              className="lineModalButtonSUbmit"
            >
              Send to Checked
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default SondBoxOQCList;
