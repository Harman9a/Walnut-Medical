import React, { useEffect, useState } from "react";

import { Bar, Line } from "react-chartjs-2";

import "chart.js/auto";

const RetestBarChartData = ({ PassData }) => {
  const [BarData, setBarData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    checkPassFailStatus(PassData);
  }, [PassData]);

  const checkPassFailStatus = (PassData) => {
    let DataLabelArr = [];
    let DataCountArr = [];

    PassData.map((x) => {
      let inputText = x.ver_res;
      const dataArray = inputText.split(", ");
      const resultObject = {};

      for (let i = 0; i < dataArray.length; i += 2) {
        const taskName = dataArray[i];
        const taskTime = parseFloat(dataArray[i + 1]);
        resultObject[taskName] = taskTime;
      }

      if (resultObject.Total_time === 5.27) {
        console.log(x);
      }

      DataLabelArr.push(new Date(x.createdAt).toLocaleString());
      DataCountArr.push(resultObject.Total_time);
    });

    let DataSetRender = {
      labels: DataLabelArr,
      datasets: [
        {
          fill: true,
          label: "Total Time",
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
        text: "Total Time",
      },
      datalabels: {
        display: false,
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
        },
        zoom: {
          pinch: {
            enabled: true, // Enable pinch zooming
          },
          wheel: {
            enabled: true, // Enable wheel zooming
          },
          mode: "x",
        },
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
