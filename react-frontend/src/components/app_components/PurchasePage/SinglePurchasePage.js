import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { SplitButton } from "primereact/splitbutton";
import client from "../../../services/restClient";
import CommentsSection from "../../common/CommentsSection";
import ProjectLayout from "../../Layouts/ProjectLayout";

import PurchaseProductPage from "../PurchaseProductPage/PurchaseProductPage";
import PurchasePaymentPage from "../PurchasePaymentPage/PurchasePaymentPage";
import { Calendar } from 'primereact/calendar';

const SinglePurchasePage = (props) => {
    const navigate = useNavigate();
    const urlParams = useParams();
    const [_entity, set_entity] = useState();
  const [isHelpSidebarVisible, setHelpSidebarVisible] = useState(false);

    const [branchId, setBranchId] = useState([]);
const [vendorId, setVendorId] = useState([]);
const [warehouseId, setWarehouseId] = useState([]);
const [purchaseType, setPurchaseType] = useState([]);
const [categoryId, setCategoryId] = useState([]);

    useEffect(() => {
        //on mount
        client
            .service("purchase")
            .get(urlParams.singlePurchaseId, { query: { $populate: [            {
                path: "createdBy",
                service: "users",
                select: ["name"],
              },{
                path: "updatedBy",
                service: "users",
                select: ["name"],
              },"branchId","vendorId","warehouseId","purchaseType","categoryId"] }})
            .then((res) => {
                set_entity(res || {});
                const branchId = Array.isArray(res.branchId)
            ? res.branchId.map((elem) => ({ _id: elem._id, name: elem.name }))
            : res.branchId
                ? [{ _id: res.branchId._id, name: res.branchId.name }]
                : [];
        setBranchId(branchId);
const vendorId = Array.isArray(res.vendorId)
            ? res.vendorId.map((elem) => ({ _id: elem._id, name: elem.name }))
            : res.vendorId
                ? [{ _id: res.vendorId._id, name: res.vendorId.name }]
                : [];
        setVendorId(vendorId);
const warehouseId = Array.isArray(res.warehouseId)
            ? res.warehouseId.map((elem) => ({ _id: elem._id, name: elem.name }))
            : res.warehouseId
                ? [{ _id: res.warehouseId._id, name: res.warehouseId.name }]
                : [];
        setWarehouseId(warehouseId);
const purchaseType = Array.isArray(res.purchaseType)
            ? res.purchaseType.map((elem) => ({ _id: elem._id, name: elem.name }))
            : res.purchaseType
                ? [{ _id: res.purchaseType._id, name: res.purchaseType.name }]
                : [];
        setPurchaseType(purchaseType);
const categoryId = Array.isArray(res.categoryId)
            ? res.categoryId.map((elem) => ({ _id: elem._id, name: elem.name }))
            : res.categoryId
                ? [{ _id: res.categoryId._id, name: res.categoryId.name }]
                : [];
        setCategoryId(categoryId);
            })
            .catch((error) => {
                console.log({ error });
                props.alert({ title: "Purchase", type: "error", message: error.message || "Failed get purchase" });
            });
    }, [props,urlParams.singlePurchaseId]);


    const goBack = () => {
        navigate("/purchase");
    };

      const toggleHelpSidebar = () => {
    setHelpSidebarVisible(!isHelpSidebarVisible);
  };

  const copyPageLink = () => {
    const currentUrl = window.location.href;

    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        props.alert({
          title: "Link Copied",
          type: "success",
          message: "Page link copied to clipboard!",
        });
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
        props.alert({
          title: "Error",
          type: "error",
          message: "Failed to copy page link.",
        });
      });
  };

    const menuItems = [
        {
            label: "Copy link",
            icon: "pi pi-copy",
            command: () => copyPageLink(),
        },
        {
            label: "Help",
            icon: "pi pi-question-circle",
            command: () => toggleHelpSidebar(),
        },
    ];

    return (
        <ProjectLayout>
        <div className="col-12 flex flex-column align-items-center">
            <div className="col-12">
                <div className="flex align-items-center justify-content-between">
                <div className="flex align-items-center">
                    <Button className="p-button-text" icon="pi pi-chevron-left" onClick={() => goBack()} />
                    <h3 className="m-0">Purchase</h3>
                    <SplitButton
                        model={menuItems.filter(
                        (m) => !(m.icon === "pi pi-trash" && items?.length === 0),
                        )}
                        dropdownIcon="pi pi-ellipsis-h"
                        buttonClassName="hidden"
                        menuButtonClassName="ml-1 p-button-text"
                    />
                </div>
                
                {/* <p>purchase/{urlParams.singlePurchaseId}</p> */}
            </div>
            <div className="card w-full">
                <div className="grid ">

            <div className="col-12 md:col-6 lg:col-3 mb-10"><label className="text-sm text-gray-600">date</label><p className="m-0 ml-3" ><Calendar id="date" value={new Date(_entity?.date)} disabled={true} hourFormat="12"   /></p></div>
<div className="col-12 md:col-6 lg:col-3 mb-10"><label className="text-sm text-gray-600">Purchase ID</label><p className="m-0 ml-3" >{Number(_entity?.purchaseId)}</p></div>
            <div className="col-12 md:col-6 lg:col-3 mb-10"><label className="text-sm text-gray-600">Branch</label>
                    {branchId.map((elem) => (
                        <Link key={elem._id} to={`/branches/${elem._id}`}>
                        <div>
                  {" "}
                            <p className="text-xl text-primary">{elem.name}</p>
                            </div>
                        </Link>
                    ))}</div>
<div className="col-12 md:col-6 lg:col-3 mb-10"><label className="text-sm text-gray-600">Vendor</label>
                    {vendorId.map((elem) => (
                        <Link key={elem._id} to={`/vendors/${elem._id}`}>
                        <div>
                  {" "}
                            <p className="text-xl text-primary">{elem.name}</p>
                            </div>
                        </Link>
                    ))}</div>
<div className="col-12 md:col-6 lg:col-3 mb-10"><label className="text-sm text-gray-600">Warehouse</label>
                    {warehouseId.map((elem) => (
                        <Link key={elem._id} to={`/warehouses/${elem._id}`}>
                        <div>
                  {" "}
                            <p className="text-xl text-primary">{elem.name}</p>
                            </div>
                        </Link>
                    ))}</div>
<div className="col-12 md:col-6 lg:col-3 mb-10"><label className="text-sm text-gray-600">Purchase Type</label>
                    {purchaseType.map((elem) => (
                        <Link key={elem._id} to={`/purchaseType/${elem._id}`}>
                        <div>
                  {" "}
                            <p className="text-xl text-primary">{elem.name}</p>
                            </div>
                        </Link>
                    ))}</div>
<div className="col-12 md:col-6 lg:col-3 mb-10"><label className="text-sm text-gray-600">Category</label>
                    {categoryId.map((elem) => (
                        <Link key={elem._id} to={`/categories/${elem._id}`}>
                        <div>
                  {" "}
                            <p className="text-xl text-primary">{elem.name}</p>
                            </div>
                        </Link>
                    ))}</div>

                    <div className="col-12">&nbsp;</div>
                </div>
            </div>
        </div>
        <div className="mt-2">
            <TabView>
                <div className="mt-2">
                <TabView>
                
                    <TabPanel header="true" leftIcon="pi pi-building-columns mr-2">
                    <PurchaseProductPage/>
                    </TabPanel>
                    

                    <TabPanel header="true" leftIcon="pi pi-building-columns mr-2">
                    <PurchasePaymentPage/>
                    </TabPanel>
                    
                </TabView></div>
            </TabView>
        </div>

      <CommentsSection
        recordId={urlParams.singlePurchaseId}
        user={props.user}
        alert={props.alert}
        serviceName="purchase"
      />
      <div
        id="rightsidebar"
        className={classNames("overlay-auto z-1 surface-overlay shadow-2 absolute right-0 w-20rem animation-duration-150 animation-ease-in-out", { "hidden" : !isHelpSidebarVisible })}
        style={{ top: "60px", height: "calc(100% - 60px)" }}
      >
        <div className="flex flex-column h-full p-4">
          <span className="text-xl font-medium text-900 mb-3">Help bar</span>
          <div className="border-2 border-dashed surface-border border-round surface-section flex-auto"></div>
        </div>
      </div>
      </div>
        </ProjectLayout>
    );
};

const mapState = (state) => {
    const { user, isLoggedIn } = state.auth;
    return { user, isLoggedIn };
};

const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(SinglePurchasePage);
