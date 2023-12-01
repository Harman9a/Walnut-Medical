import React, { useEffect, useState } from "react";
import axios from "axios";
import { Col, DatePicker, Result, Row, Spin } from "antd";
import moment from "moment";
import BarChartData from "./components/BarChartData";
import dayjs from "dayjs";
import PieChartData from "./components/PieChartData";
import FailReasonBarChartData from "./components/FailReasonBarChartData";
import RetestBarChartData from "./components/RetestBarChartData";
import TimeOutAreaChartData from "./components/TimeOutAreaChartData";

const DataResultOneDay = () => {
  const [allData, setAllData] = useState([]);
  const [renderData, setRenderData] = useState([]);
  const [reRestRenderData, setReTestRenderData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData(new Date().toDateString());
  }, []);

  const getData = (startDate) => {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_API_URL}/GetSingleDayData`, {
        startDate,
      })
      .then((result) => {
        let data = result.data;

        removeDublicateTest(data);

        setAllData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDateChnage = (date, dateString) => {
    getData(dateString);
  };

  const disabledDate = (current) => {
    return current && current > moment().endOf("day");
  };

  const removeDublicateTest = (arr) => {
    let { uniqueArr, reTestArr } = filterData(arr);

    setRenderData(uniqueArr);
    setReTestRenderData(reTestArr);
  };

  const filterData = (arr) => {
    let reTestData = [];

    let uniqueImeis = new Set();

    let uniqueArr = arr.filter((obj) => {
      if (!uniqueImeis.has(obj.imei)) {
        uniqueImeis.add(obj.imei);
        return true;
      }
      reTestData.push(obj);
      return false;
    });

    let uniqueImeis2 = new Set();

    let uniqueArr2 = reTestData.filter((obj) => {
      if (!uniqueImeis2.has(obj.imei)) {
        uniqueImeis2.add(obj.imei);
        return true;
      }
      return false;
    });

    return { uniqueArr, reTestArr: uniqueArr2 };
  };

  return (
    <div>
      <div>
        <div>
          <div>
            <DatePicker
              className="TopMenuButton2"
              defaultValue={dayjs(new Date())}
              disabledDate={disabledDate}
              onChange={(date, dateString) =>
                handleDateChnage(date, dateString)
              }
            />
          </div>
        </div>
        <Spin spinning={loading}>
          {allData.length === 0 ? (
            <Result
              icon={<img src="./SVG/noitem.svg" />}
              subTitle="No Item Found"
            />
          ) : (
            <div style={{ marginTop: "25px" }}>
              <Row>
                {/* <Col span={12}>
                  <BarChartData renderData={renderData} />
                </Col>
                <Col className="myDataView" span={12}>
                  <PieChartData renderData={renderData} />
                </Col>
                <Col span={24}>
                  <FailReasonBarChartData renderData={renderData} />
                </Col>
                <Col span={24}>
                  <RetestBarChartData
                    allData={allData}
                    renderData={reRestRenderData}
                  />
                </Col> */}
                <Col span={24}>
                  <TimeOutAreaChartData
                    allData={allData}
                    renderData={renderData}
                  />
                </Col>
              </Row>
            </div>
          )}
        </Spin>
      </div>
    </div>
  );
};

export default DataResultOneDay;
