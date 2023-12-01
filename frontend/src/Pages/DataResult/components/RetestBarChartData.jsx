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
    let DataSetLabelArr = [];
    let DataCountArr = [];

    data.map((x) => {
      let retest_count = 0;
      allData.map((y) => {
        if (x.imei === y.imei) {
          retest_count++;
          x.retest_count = retest_count;
        }
      });
    });

    // console.log(allData, data);

    // let uniqueImeis = new Set();
    // let uniqueArr = data.filter((obj) => {
    //   if (!uniqueImeis.has(obj.imei)) {
    //     uniqueImeis.add(obj.imei);
    //     return true;
    //   }
    //   console.log(obj.imei);
    //   return false;
    // });

    // uniqueArr.map((x) => {
    //   if (x.fail_reason !== "None") {
    //     let failCount = 0;
    //     data.map((y) => {
    //       if (x.fail_reason === y.fail_reason) {
    //         failCount++;
    //       }
    //     });
    //     DataLabelArr.push(x.fail_reason);
    //     DataCountArr.push(failCount);
    //   }
    // });

    data.map((x) => {
      DataLabelArr.push(x.ver_app);
      DataCountArr.push(x.retest_count);
      DataSetLabelArr.push(x.imei);
    });

    console.log(DataLabelArr, DataCountArr);

    let DataSetRender = {
      fill: true,
      labels: DataLabelArr,
      datasets: [
        {
          label: "Dataset 1",
          imei: DataSetLabelArr,
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
      tooltip: {
        callbacks: {
          label: (d) => {
            return `IMEI :- ${d.dataset.imei[d.dataIndex]}`;
          },
        },
      },
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Re-Test",
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

export default RetestBarChartData;
