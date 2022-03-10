import React, { useState, useEffect, useCallback, createRef } from "react";
import DataGrid, {
  FilterRow,
  HeaderFilter,
  SearchPanel,
  Grouping,
  GroupPanel,
  ColumnChooser,
  ColumnFixing,
  Summary,
  TotalItem,
  Export,
  Toolbar,
  Item,
  Paging,
} from "devextreme-react/data-grid";
import { Workbook } from "exceljs";
import { exportDataGrid } from "devextreme/excel_exporter";
import saveAs from "file-saver";
import Button from "devextreme-react/button";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";
import { Pagination } from "antd";

const Table = ({ fetchGridData, columns, pageSizes }) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  let dataGridRef = createRef();

  const customizeSummary = (data) => {
    return data.value?.toLocaleString("en-US", {
      style: "currency",
      currency: "INR",
    });
  };

  useEffect(() => {
    (async () => {
      const data = await fetchGridData(currentPage, pageSize);
      setData(data);
    })();
  }, [currentPage, pageSize]);

  const summaryColumns = [];
  const columnData = columns.map((column) => {
    if (column.summaryType) {
      summaryColumns.push(column);
    }
    return {
      ...column,
      customizeText: column.format === "currency" ? customizeSummary : "",
    };
  });

  const handelXlsExport = (e) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Main sheet");
    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(
          new Blob([buffer], { type: "application/octet-stream" }),
          "DataGrid.xlsx"
        );
      });
    });
    e.cancel = true;
  };

  const exportGridToPdf = useCallback(() => {
    const doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a1",
      putOnlyUsedFonts: true,
    });
    const dataGrid = dataGridRef.current.instance;
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: dataGrid,
    }).then(() => {
      doc.save("Customers.pdf");
    });
  });

  return (
    <div>
      <DataGrid
        id="gridContainer"
        ref={dataGridRef}
        dataSource={data}
        columns={columnData}
        keyExpr="ID"
        showBorders={true}
        allowColumnReordering={true}
        allowColumnResizing={true}
        columnAutoWidth={true}
        onExporting={handelXlsExport}
      >
        <Paging enabled={false} />
        <FilterRow
          visible={true}
          applyFilter={{
            key: "auto",
            name: "Immediately",
          }}
        />
        <HeaderFilter visible={true} />
        <GroupPanel visible={true} />
        <SearchPanel visible={true} width={240} placeholder="Search..." />
        <Grouping autoExpandAll={false} />
        <ColumnChooser enabled={true} mode="select" />
        <ColumnFixing enabled={true} />
        <Summary>
          {summaryColumns.map((item) => (
            <TotalItem
              key={item.dataField}
              column={item.dataField}
              summaryType={item.summaryType}
              customizeText={item.summaryType === "sum" ? customizeSummary : ""}
            />
          ))}
        </Summary>
        <Export enabled={true} excelFilterEnabled={true} />
        <Toolbar>
          <Item name="groupPanel" />
          <Item location="after">
            <Button icon="pdffile" onClick={exportGridToPdf} />
          </Item>
          <Item name="exportButton" />
          <Item name="columnChooserButton" />
          <Item name="searchPanel" />
        </Toolbar>
      </DataGrid>
      <Pagination
        pageSizeOptions={pageSizes ? pageSizes : [10, 20, 50, 100, 200, 500]}
        onShowSizeChange={(current, pageSize) => setPageSize(pageSize)}
        defaultCurrent={1}
        current={currentPage !== 0 ? parseInt(currentPage) : 1}
        showTotal={(total, range) => {
          return `${range[0]}-${range[1]} of ${total} records`;
        }}
        total={data?.[0]?.total_count}
        onChange={(pageNumber) => {
          setCurrentPage(parseInt(pageNumber));
        }}
      />
    </div>
  );
};
export default Table;
