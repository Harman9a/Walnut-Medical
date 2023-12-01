import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartDataLabels);

const FailReasonBarChartData = ({ renderData }) => {
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
      if (!uniqueImeis.has(obj.fail_reason)) {
        uniqueImeis.add(obj.fail_reason);
        return true;
      }
      return false;
    });

    uniqueArr.map((x) => {
      if (x.fail_reason !== "None") {
        let failCount = 0;
        data.map((y) => {
          if (x.fail_reason === y.fail_reason) {
            failCount++;
          }
        });
        DataLabelArr.push(x.fail_reason);
        DataCountArr.push(failCount);
      }
    });

    let DataSetRender = {
      labels: DataLabelArr,
      datasets: [
        {
          label: "Dataset 1",
          data: DataCountArr,
          backgroundColor: "#2b3e50",
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
        text: "Fail Resson",
      },
      datalabels: {
        formatter: (value) => {
          return value;
        },
        color: "white",
      },
    },
  };

  return (
    <div>
      <div>
        <Bar options={options} data={BarData} />
      </div>
    </div>
  );
};

export default FailReasonBarChartData;
