import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Table,
  Button,
  Input,
  Space,
  Popconfirm,
  Spin,
  DatePicker,
  Dropdown,
} from "antd";

import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import { useDownloadExcel } from "react-export-table-to-excel";
import qs from "qs";
import { saveAs } from "file-saver";

import { DownloadOutlined } from "@ant-design/icons";

const PostDataShow = () => {
  const [ApiData, setApiData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [tableFilterType, setTableFilterType] = useState("");
  const [tableFilterValue, setTableFilterValue] = useState("");
  const [tableFilterCloseButton, setTableFilterCloseButton] = useState();

  const { RangePicker } = DatePicker;

  const handleSearch = (selectedKeys, confirm, dataIndex, close) => {
    getData(1, dataIndex, selectedKeys[0]);
    setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    setTableFilterType("");
    setTableFilterValue("");
    getData();
    clearFilters();
    setSearchText("");
  };

  // useEffect(() => {
  //   getData();
  // }, []);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          // ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          // value={selectedKeys[0]}
          onKeyUp={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
            console.log(dataIndex, e.target.value);
            setTableFilterType(dataIndex);
            setTableFilterValue(e.target.value);
          }}
          // onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys, confirm, dataIndex, close)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) => text,
  });

  const renderData = (data) => {
    let newArr = [];

    let itemNumber =
      tableParams.pagination.current * tableParams.pagination.pageSize -
      tableParams.pagination.pageSize +
      1;

    data.map((x, i) => {
      let jData = x;

      newArr.push({
        action: x._id,
        no: itemNumber,
        imei: jData.imei == undefined ? "none" : jData.imei,
        apn: jData.apn == undefined ? "none" : jData.apn,
        app_install:
          jData.app_install == undefined ? "none" : jData.app_install,
        appdl: jData.appdl == undefined ? "none" : jData.appdl,
        audio_current:
          jData.audio_current == undefined ? "none" : jData.audio_current,
        audio_voltage:
          jData.audio_voltage == undefined ? "none" : jData.audio_voltage,
        custom_1: jData.custom_1 == undefined ? "none" : jData.custom_1,
        custom_2: jData.custom_2 == undefined ? "none" : jData.custom_2,
        fail_reason:
          jData.fail_reason == undefined ? "none" : jData.fail_reason,
        file_cleanup:
          jData.file_cleanup == undefined ? "none" : jData.file_cleanup,
        file_list: jData.file_list == undefined ? "none" : jData.file_list,
        fota_command:
          jData.fota_command == undefined ? "none" : jData.fota_command,
        fotadl: jData.fotadl == undefined ? "none" : jData.fotadl,
        full_char_current:
          jData.full_char_current == undefined
            ? "none"
            : jData.full_char_current,
        full_char_voltage:
          jData.full_char_voltage == undefined
            ? "none"
            : jData.full_char_voltage,

        key1: jData.key1 == undefined ? "none" : jData.key1,
        key2: jData.key2 == undefined ? "none" : jData.key2,
        key3: jData.key3 == undefined ? "none" : jData.key3,
        key4: jData.key4 == undefined ? "none" : jData.key4,
        key5: jData.key5 == undefined ? "none" : jData.key5,
        ledblue: jData.ledblue == undefined ? "none" : jData.ledblue,
        ledgreen: jData.ledgreen == undefined ? "none" : jData.ledgreen,
        ledred: jData.ledred == undefined ? "none" : jData.ledred,
        low_batt_current:
          jData.low_batt_current == undefined ? "none" : jData.low_batt_current,
        low_batt_voltage:
          jData.low_batt_voltage == undefined ? "none" : jData.low_batt_voltage,
        memfree: jData.memfree == undefined ? "none" : jData.memfree,
        memid: jData.memid == undefined ? "none" : jData.memid,
        memtotal: jData.memtotal == undefined ? "none" : jData.memtotal,
        memused: jData.memused == undefined ? "none" : jData.memused,
        pdp_status: jData.pdp_status == undefined ? "none" : jData.pdp_status,
        prdappver: jData.prdappver == undefined ? "none" : jData.prdappver,
        readtime: jData.readtime == undefined ? "none" : jData.readtime,
        resourcedl: jData.resourcedl == undefined ? "none" : jData.resourcedl,
        sha_app: jData.sha_app == undefined ? "none" : jData.sha_app,
        sha_dfota: jData.sha_dfota == undefined ? "none" : jData.sha_dfota,
        sha_res: jData.sha_res == undefined ? "none" : jData.sha_res,
        sim: jData.sim == undefined ? "none" : jData.sim,
        standby_current:
          jData.standby_current == undefined ? "none" : jData.standby_current,
        test_result:
          jData.test_result == undefined ? "none" : jData.test_result,
        token: jData.token == undefined ? "none" : jData.token,
        unzip_app: jData.unzip_app == undefined ? "none" : jData.unzip_app,
        unzip_dfota:
          jData.unzip_dfota == undefined ? "none" : jData.unzip_dfota,
        unzip_res: jData.unzip_res == undefined ? "none" : jData.unzip_res,
        ver_app: jData.ver_app == undefined ? "none" : jData.ver_app,
        ver_dfota: jData.ver_dfota == undefined ? "none" : jData.ver_dfota,
        ver_res: jData.ver_res == undefined ? "none" : jData.ver_res,
        writetime: jData.writetime == undefined ? "none" : jData.writetime,
        datetime: new Date(x.createdAt).toLocaleString(),
      });
      itemNumber++;
    });
    setApiData(newArr);
  };

  useEffect(() => {
    getData();
  }, [JSON.stringify(tableParams)]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setApiData([]);
    }
  };

  const getRandomuserParams = (params) => ({
    results: params.pagination?.pageSize,
    page: params.pagination?.current,
    ...params,
  });

  const getData = () => {
    if (startDate === "" && endDate === "") {
      if (tableFilterType === "" || tableFilterValue === "") {
        filterDataWithoutDate();
      } else {
        getDataWithFilter();
      }
    } else {
      if (tableFilterType === "" || tableFilterValue === "") {
        console.log("if");
        filterDataByDate();
      } else {
        console.log("else");
        getDataWithFilter();
      }
    }
  };

  const getDataWithFilter = () => {
    setLoading(true);
    axios
      .post(
        `${
          process.env.REACT_APP_API_URL
        }/getPostResponseWithFilter?${qs.stringify(
          getRandomuserParams(tableParams)
        )}`,
        {
          type: tableFilterType,
          value: tableFilterValue,
        }
      )
      .then((result) => {
        let data = result.data.results;
        let totalCount = result.data.totalCount;
        console.log(data, totalCount);
        // tableFilterCloseButton();
        renderData(data);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: totalCount,
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const filterDataWithoutDate = () => {
    setLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/getPostResponse?${qs.stringify(
          getRandomuserParams(tableParams)
        )}`
      )
      .then((result) => {
        let data = result.data.results;
        let totalCount = result.data.totalCount;
        renderData(data);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: totalCount,
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const filterDataByDate = () => {
    setLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/getPostResponseFilter?${qs.stringify(
          getRandomuserParams(tableParams)
        )}`,
        {
          startDate,
          endDate,
        }
      )
      .then((result) => {
        let data = result.data.results;
        let totalCount = result.data.totalCount;
        renderData(data);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: totalCount,
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDateChnage = (date, string) => {
    setStartDate(string[0]);
    setEndDate(string[1]);
  };

  const columns = [
    // {
    //   title: "Action",
    //   dataIndex: "action",
    //   key: "action",
    //   render: (id) => {
    //     return (
    //       <div style={{ cursor: "pointer" }}>
    //         <Popconfirm
    //           title="Are you sure"
    //           onConfirm={() => handleDelete(id)}
    //           okText="Yes"
    //           cancelText="No"
    //         >
    //           <DeleteOutlined style={{ fontSize: "14px", color: "red" }} />
    //         </Popconfirm>
    //       </div>
    //     );
    //   },
    // },
    {
      title: "No",
      dataIndex: "no",
      key: "no",
    },

    {
      title: "IMEI",
      dataIndex: "imei",
      key: "imei",
      ...getColumnSearchProps("imei"),
    },

    {
      title: "APN",
      dataIndex: "apn",
      key: "apn",
    },
    {
      title: "App Install",
      dataIndex: "app_install",
      key: "app_install",
    },

    {
      title: "Appdl",
      dataIndex: "appdl",
      key: "appdl",
    },

    {
      title: "Audio Current",
      dataIndex: "audio_current",
      key: "audio_current",
    },

    {
      title: "Audio Voltage",
      dataIndex: "audio_voltage",
      key: "audio_voltage",
    },

    {
      title: "Custom 1",
      dataIndex: "custom_1",
      key: "custom_1",
    },

    {
      title: "Custom 2",
      dataIndex: "custom_2",
      key: "custom_2",
    },

    {
      title: "Fail Reason",
      dataIndex: "fail_reason",
      key: "fail_reason",
    },

    {
      title: "File Cleanup",
      dataIndex: "file_cleanup",
      key: "file_cleanup",
    },

    {
      title: "File List",
      dataIndex: "file_list",
      key: "file_list",
    },

    {
      title: "Fota Command",
      dataIndex: "fota_command",
      key: "fota_command",
    },

    {
      title: "Fotadl",
      dataIndex: "fotadl",
      key: "fotadl",
    },

    {
      title: "Full Char Current",
      dataIndex: "full_char_current",
      key: "full_char_current",
    },

    {
      title: "Full Char Voltage",
      dataIndex: "full_char_voltage",
      key: "full_char_voltage",
    },

    {
      title: "Key 1",
      dataIndex: "key1",
      key: "key1",
    },

    {
      title: "Key 2",
      dataIndex: "key2",
      key: "key2",
    },

    {
      title: "Key 3",
      dataIndex: "key3",
      key: "key3",
    },

    {
      title: "Key 4",
      dataIndex: "key4",
      key: "key4",
    },

    {
      title: "key 5",
      dataIndex: "key5",
      key: "key5",
    },

    {
      title: "Led Blue",
      dataIndex: "ledblue",
      key: "ledblue",
    },
    {
      title: "Led Green",
      dataIndex: "ledgreen",
      key: "ledgreen",
    },
    {
      title: "Led Red",
      dataIndex: "ledred",
      key: "ledred",
    },
    {
      title: "Low Batt Current",
      dataIndex: "low_batt_current",
      key: "low_batt_current",
    },
    {
      title: "Low Batt Voltage",
      dataIndex: "low_batt_voltage",
      key: "low_batt_voltage",
    },
    {
      title: "Mem Free",
      dataIndex: "memfree",
      key: "memfree",
    },
    {
      title: "Mem Id",
      dataIndex: "memid",
      key: "memid",
    },
    {
      title: "Mem Total",
      dataIndex: "memtotal",
      key: "memtotal",
    },
    {
      title: "Mem Used",
      dataIndex: "memused",
      key: "memused",
    },
    {
      title: "PDP Status",
      dataIndex: "pdp_status",
      key: "pdp_status",
    },
    {
      title: "Prdappver",
      dataIndex: "prdappver",
      key: "prdappver",
    },
    {
      title: "Read Time",
      dataIndex: "readtime",
      key: "readtime",
    },
    {
      title: "Resourcedl",
      dataIndex: "resourcedl",
      key: "resourcedl",
    },
    {
      title: "Sha App",
      dataIndex: "sha_app",
      key: "sha_app",
    },
    {
      title: "Sha Dfota",
      dataIndex: "sha_dfota",
      key: "sha_dfota",
    },
    {
      title: "Sha Res",
      dataIndex: "sha_res",
      key: "sha_res",
    },
    {
      title: "Sim",
      dataIndex: "sim",
      key: "sim",
    },
    {
      title: "Standby Current",
      dataIndex: "standby_current",
      key: "standby_current",
    },
    {
      title: "Test Result",
      dataIndex: "test_result",
      key: "test_result",
    },
    {
      title: "Token",
      dataIndex: "token",
      key: "token",
    },
    {
      title: "Unzip App",
      dataIndex: "unzip_app",
      key: "unzip_app",
    },
    {
      title: "Unzip Dfota",
      dataIndex: "unzip_dfota",
      key: "unzip_dfota",
    },
    {
      title: "Unzip Res",
      dataIndex: "unzip_res",
      key: "unzip_res",
    },
    {
      title: "Ver App",
      dataIndex: "ver_app",
      key: "ver_app",
    },
    {
      title: "Ver Dfota",
      dataIndex: "ver_dfota",
      key: "ver_dfota",
    },
    {
      title: "Ver Res",
      dataIndex: "ver_res",
      key: "ver_res",
    },
    {
      title: "Write Time",
      dataIndex: "writetime",
      key: "writetime",
    },
    {
      title: "Date & Time",
      dataIndex: "datetime",
      key: "datetime",
    },
  ];

  const tableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Web User",
    Sheet: "Web User",
  });

  const handleExcelImport = () => {
    if (startDate === "" && endDate === "") {
      downloadDataWithoutDate();
    } else {
      downloadDataWithDate();
    }
  };

  const downloadThis = (data, name) => {
    const wb = XLSX.utils.book_new();

    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    };

    let newApidata = data.filter((x) => x);

    const formattedBatchList = newApidata.map((item) => {
      const { action, ...rest } = item;
      return {
        ...rest,
      };
    });
    const ws = XLSX.utils.json_to_sheet(formattedBatchList);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.xlsx`;
    a.click();
  };

  const makeArrofRawData = (data, name) => {
    let newArr = [];

    let itemNumber =
      tableParams.pagination.current * tableParams.pagination.pageSize -
      tableParams.pagination.pageSize +
      1;

    data.map((x, i) => {
      let jData = x;

      newArr.push({
        action: x._id,
        no: itemNumber,
        imei: jData.imei == undefined ? "none" : jData.imei,
        apn: jData.apn == undefined ? "none" : jData.apn,
        app_install:
          jData.app_install == undefined ? "none" : jData.app_install,
        appdl: jData.appdl == undefined ? "none" : jData.appdl,
        audio_current:
          jData.audio_current == undefined ? "none" : jData.audio_current,
        audio_voltage:
          jData.audio_voltage == undefined ? "none" : jData.audio_voltage,
        custom_1: jData.custom_1 == undefined ? "none" : jData.custom_1,
        custom_2: jData.custom_2 == undefined ? "none" : jData.custom_2,
        fail_reason:
          jData.fail_reason == undefined ? "none" : jData.fail_reason,
        file_cleanup:
          jData.file_cleanup == undefined ? "none" : jData.file_cleanup,
        file_list: jData.file_list == undefined ? "none" : jData.file_list,
        fota_command:
          jData.fota_command == undefined ? "none" : jData.fota_command,
        fotadl: jData.fotadl == undefined ? "none" : jData.fotadl,
        full_char_current:
          jData.full_char_current == undefined
            ? "none"
            : jData.full_char_current,
        full_char_voltage:
          jData.full_char_voltage == undefined
            ? "none"
            : jData.full_char_voltage,

        key1: jData.key1 == undefined ? "none" : jData.key1,
        key2: jData.key2 == undefined ? "none" : jData.key2,
        key3: jData.key3 == undefined ? "none" : jData.key3,
        key4: jData.key4 == undefined ? "none" : jData.key4,
        key5: jData.key5 == undefined ? "none" : jData.key5,
        ledblue: jData.ledblue == undefined ? "none" : jData.ledblue,
        ledgreen: jData.ledgreen == undefined ? "none" : jData.ledgreen,
        ledred: jData.ledred == undefined ? "none" : jData.ledred,
        low_batt_current:
          jData.low_batt_current == undefined ? "none" : jData.low_batt_current,
        low_batt_voltage:
          jData.low_batt_voltage == undefined ? "none" : jData.low_batt_voltage,
        memfree: jData.memfree == undefined ? "none" : jData.memfree,
        memid: jData.memid == undefined ? "none" : jData.memid,
        memtotal: jData.memtotal == undefined ? "none" : jData.memtotal,
        memused: jData.memused == undefined ? "none" : jData.memused,
        pdp_status: jData.pdp_status == undefined ? "none" : jData.pdp_status,
        prdappver: jData.prdappver == undefined ? "none" : jData.prdappver,
        readtime: jData.readtime == undefined ? "none" : jData.readtime,
        resourcedl: jData.resourcedl == undefined ? "none" : jData.resourcedl,
        sha_app: jData.sha_app == undefined ? "none" : jData.sha_app,
        sha_dfota: jData.sha_dfota == undefined ? "none" : jData.sha_dfota,
        sha_res: jData.sha_res == undefined ? "none" : jData.sha_res,
        sim: jData.sim == undefined ? "none" : jData.sim,
        standby_current:
          jData.standby_current == undefined ? "none" : jData.standby_current,
        test_result:
          jData.test_result == undefined ? "none" : jData.test_result,
        token: jData.token == undefined ? "none" : jData.token,
        unzip_app: jData.unzip_app == undefined ? "none" : jData.unzip_app,
        unzip_dfota:
          jData.unzip_dfota == undefined ? "none" : jData.unzip_dfota,
        unzip_res: jData.unzip_res == undefined ? "none" : jData.unzip_res,
        ver_app: jData.ver_app == undefined ? "none" : jData.ver_app,
        ver_dfota: jData.ver_dfota == undefined ? "none" : jData.ver_dfota,
        ver_res: jData.ver_res == undefined ? "none" : jData.ver_res,
        writetime: jData.writetime == undefined ? "none" : jData.writetime,
        datetime: new Date(x.createdAt).toLocaleString(),
      });
      itemNumber++;
    });
    downloadThis(newArr, name);
  };

  const downloadDataWithoutDate = async () => {
    try {
      // Make a GET request to the specified endpoint with 'arraybuffer' responseType
      const response = await axios.get(
        `
        ${process.env.REACT_APP_API_URL}/downloadDataWithoutDate`,
        { responseType: "arraybuffer" }
      );

      // Create a Blob from the binary data
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Use FileSaver to save the Blob as a file
      saveAs(blob, "Post_Report_full.xlsx");
    } catch (error) {
      // Handle errors
      console.error(error);
    }
    // setLoading2(true);
    // axios
    //   .get(`${process.env.REACT_APP_API_URL}/downloadDataWithoutDate`)
    //   .then((result) => {
    //     let data = result.data;
    //     console.log(data);
    //     // makeArrofRawData(data, "Post_Report_full");
    //     setLoading2(false);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  const downloadDataWithDate = () => {
    setLoading2(true);
    axios
      .post(`${process.env.REACT_APP_API_URL}/downloadDataWithDate`, {
        startDate,
        endDate,
      })
      .then((result) => {
        let data = result.data;
        makeArrofRawData(data, `Post_Report_${startDate}_to_${endDate}`);
        setLoading2(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleTodayOnlyImport = () => {
    setLoading2(true);
    let startDate = new Date().toLocaleDateString();
    axios
      .post(`${process.env.REACT_APP_API_URL}/downloadDataToday`, {
        startDate,
      })
      .then((result) => {
        let data = result.data;
        makeArrofRawData(data, `Post_Report_${startDate}`);
        setLoading2(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = (id) => {
    setLoading(true);
    axios
      .post(process.env.REACT_APP_API_URL + "/deletePostResponse", { id })
      .then((result) => {
        setLoading(false);
        console.log(result.data);
        getData();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onMenuClick = (e) => {
    if (e.key == 1) {
      handleExcelImport();
    }
    if (e.key == 2) {
      handleTodayOnlyImport();
    }
  };

  const items = [
    {
      key: "1",
      label: "Full Report",
    },
    {
      key: "2",
      label: "Today Only Report",
    },
  ];

  return (
    <div>
      <Spin spinning={loading2}>
        {/* <Button className="TopMenuButton2" onClick={() => handleExcelImport()}>
          Download Report <DownloadOutlined />
        </Button> */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            {/* <Button
              className="TopMenuButton2"
              onClick={() => handleExcelImport()}
            >
              Download Report <DownloadOutlined />
            </Button> */}
            <Dropdown.Button
              className="TopMenuButton3"
              onClick={() => handleExcelImport()}
              menu={{
                items,
                onClick: onMenuClick,
              }}
            >
              Download Report
            </Dropdown.Button>
          </div>
          <div>
            <RangePicker
              className="TopMenuButton2"
              onChange={(date, string) => handleDateChnage(date, string)}
              style={{ width: "220px" }}
            />
            <Button
              className="TopMenuButton2"
              onClick={() => {
                getData();
              }}
              style={{ width: "unset" }}
            >
              <SearchOutlined />
            </Button>
          </div>
        </div>
        <div style={{ marginTop: "25px" }}>
          <Table
            columns={columns}
            dataSource={ApiData}
            scroll={{ x: 6200 }}
            rowKey={(record) => record._id}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
          />
        </div>
      </Spin>
    </div>
  );
};

export default PostDataShow;
