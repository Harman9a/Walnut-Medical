import { Result, Spin } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

const DataResultCurrent = () => {
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_API_URL}/GetCurentData`)
      .then((result) => {
        let data = result.data;

        console.log(data);

        setAllData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <div>
      <Spin spinning={loading}>
        {allData.length === 0 ? (
          <Result
            icon={<img src="./SVG/noitem.svg" />}
            subTitle="No Data Found Select Another Date"
          />
        ) : (
          <div style={{ marginTop: "25px" }}>
            {JSON.stringify(allData.length)}
          </div>
        )}
      </Spin>
    </div>
  );
};

export default DataResultCurrent;
