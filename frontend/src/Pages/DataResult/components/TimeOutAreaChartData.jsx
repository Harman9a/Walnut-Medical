import React, { useEffect, useState } from "react";

import { Bar, Line } from "react-chartjs-2";

import "chart.js/auto";

const RetestBarChartData = ({ renderData, allData }) => {
  const [BarData, setBarData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    checkPassFailStatus(renderData);
  }, [renderData]);

  const checkPassFailStatus = (data) => {
    let DataLabelArr = [];
    let DataCountArr = [];

    let uniqueImeis = new Set();
    let uniqueArr = data.filter((obj) => {
      if (!uniqueImeis.has(new Date(obj.createdAt).toLocaleString())) {
        uniqueImeis.add(new Date(obj.createdAt).toLocaleString());
        return true;
      }
      return false;
    });

    uniqueArr.map((x) => {
      let inputText = x.ver_res;
      const dataArray = inputText.split(", ");
      const resultObject = {};

      for (let i = 0; i < dataArray.length; i += 2) {
        const taskName = dataArray[i];
        const taskTime = parseFloat(dataArray[i + 1]);
        resultObject[taskName] = taskTime;
      }

      DataLabelArr.push(new Date(x.createdAt).toLocaleString());
      DataCountArr.push(resultObject.Total_time);
    });

    let DataSetRender = {
      labels: DataLabelArr,
      datasets: [
        {
          fill: true,
          label: "Dataset 1",
          data: DataCountArr,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    };

    setBarData(DataSetRender);
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Re-Test",
      },
      datalabels: {
        display: false,
      },
    },
  };

  return (
    <div>
      <div>
        <Line options={options} data={BarData} />
      </div>
    </div>
  );
};

export default RetestBarChartData;
