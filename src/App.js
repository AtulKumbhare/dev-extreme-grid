import React from "react";
import normalize from "normalize-object";
// import "devextreme/dist/css/dx.light.css";
import "./dx.material.custom-scheme.css";
import "antd/dist/antd.css";
import "./App.css";
import DevExTable from "./Table";

const authToken = localStorage.getItem("accessToken");

const App = () => {
  const fetchGridData = async (currentPage, pageSize) => {
    const params = {
      filters: {
        report_name: "ControlTowerSubscriptionReport",
        user_type_enum: "1",
      },
      offset: currentPage === 1 ? 0 : currentPage * pageSize,
      page_size: pageSize,
      isSubscription: true,
    };
    let res = await fetch(
      "https://prepapi.biofuelcircle.com:8060/BioFuelCommonUtilities/api/Report/GetInbuiltReport",
      {
        method: "POST",
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      }
    );
    res = await res.json();
    let resData = normalize(res, "snake");
    resData = resData?.data?.map((item) => ({ ...item, ID: item.id }));
    return resData;
  };

  const columns = [
    {
      dataField: "entity_name",
      caption: "Business",
      width: 200,
      fixed: true,
    },
    {
      dataField: "entity_type",
      caption: "Business Type",
    },
    {
      dataField: "nature_of_business_enum_code",
      caption: "Nature of Business",
    },
    {
      dataField: "subscription_plan_name",
      caption: "Subscription Pack",
    },
    {
      caption: "Subscription Status",
      dataField: "subscription_status",
    },
    {
      caption: "Location",
      dataField: "location_name",
    },
    {
      caption: "Start Date",
      dataField: "subscription_start_date",
      dataType: "date",
      format: "dd-MMM-yyyy",
    },
    {
      caption: "End Date",
      dataField: "subscription_end_date",
      dataType: "date",
      format: "dd-MMM-yyyy",
    },
    {
      caption: "KYC Status",
      dataField: "kyc_status_enum_code",
    },
    {
      caption: "Users",
      dataField: "licenses_used",
      summaryType: "count",
    },
    {
      caption: "Invoice Number",
      dataField: "custom_invoice_number",
    },
    {
      caption: "Prepaid Balance",
      dataField: "prepaid_balance",
      format: "currency",
      precision: 3,
      cssClass: "green",
      summaryType: "sum",
    },
    {
      caption: "Invoice Base Amount",
      dataField: "invoice_base_amount",
      dataType: "number",
      format: "currency",
      precision: 3,
      cssClass: "green",
      summaryType: "sum",
    },
    {
      caption: "Discount",
      dataField: "discount_amount",
      format: "currency",
      precision: 3,
      cssClass: "red",
      summaryType: "sum",
    },
    {
      caption: "Tax Amount",
      dataField: "tax_amount",
      format: "currency",
      precision: 3,
      cssClass: "green",
      summaryType: "sum",
    },
    {
      caption: "Invoice Amount",
      dataField: "total_invoice_amount",
      format: "currency",
      precision: 3,
      cssClass: "green",
      summaryType: "sum",
    },
    {
      caption: "Amount Paid",
      dataField: "amount_paid",
      format: "currency",
      precision: 3,
      cssClass: "green",
      summaryType: "sum",
    },
    {
      caption: "Payment Status",
      dataField: "invoice_status_enum_code",
    },
  ];

  return (
    <DevExTable
      fetchGridData={fetchGridData}
      columns={columns}
      // pageSizes={[10, 20, 50, 100, 500]}
    />
  );
};
export default App;
