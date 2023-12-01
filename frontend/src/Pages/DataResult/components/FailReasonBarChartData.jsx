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

const FailReasonBarChartData = ({ FailData }) => {
  const [BarData, setBarData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    checkPassFailStatus(FailData);
  }, [FailData]);

  const checkPassFailStatus = (data) => {
    let DataLabelArr = [];
    let DataCountArr = [];

    let uniqueFailResons = new Set();
    let fail_reasons = data.filter((obj) => {
      if (!uniqueFailResons.has(obj.fail_reason)) {
        uniqueFailResons.add(obj.fail_reason);
        return true;
      }
      return false;
    });

    fail_reasons.map((x) => {
      let failCount = 0;
      data.map((y) => {
        if (x.fail_reason === y.fail_reason) {
          failCount++;
        }
      });
      DataLabelArr.push(x.fail_reason);
      DataCountArr.push(failCount);
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
