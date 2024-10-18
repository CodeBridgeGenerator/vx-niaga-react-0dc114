import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Tag } from 'primereact/tag';
import moment from "moment";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
const statusArray = ["Pending","Processing","Completed"];
const statusOptions = statusArray.map((x) => ({ name: x, value: x }));

const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = {};
    for (const key in errorObj.errors) {
        if (Object.hasOwnProperty.call(errorObj.errors, key)) {
            const element = errorObj.errors[key];
            if (element?.message) {
                errMsg.push(element.message);
            }
        }
    }
    return errMsg.length ? errMsg : errorObj.message ? errorObj.message : null;
};

const PurchaseCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [branchId, setBranchId] = useState([])
const [vendorId, setVendorId] = useState([])
const [warehouseId, setWarehouseId] = useState([])
const [purchaseType, setPurchaseType] = useState([])
const [categoryId, setCategoryId] = useState([])

    useEffect(() => {
        set_entity(props.entity);
    }, [props.entity, props.show]);

     useEffect(() => {
                    //on mount branches
                    client
                        .service("branches")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleBranchesId } })
                        .then((res) => {
                            setBranchId(res.data.map((e) => { return { name: e['name'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Branches", type: "error", message: error.message || "Failed get branches" });
                        });
                }, []);
 useEffect(() => {
                    //on mount vendors
                    client
                        .service("vendors")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleVendorsId } })
                        .then((res) => {
                            setVendorId(res.data.map((e) => { return { name: e['name'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Vendors", type: "error", message: error.message || "Failed get vendors" });
                        });
                }, []);
 useEffect(() => {
                    //on mount warehouses
                    client
                        .service("warehouses")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleWarehousesId } })
                        .then((res) => {
                            setWarehouseId(res.data.map((e) => { return { name: e['name'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Warehouses", type: "error", message: error.message || "Failed get warehouses" });
                        });
                }, []);
 useEffect(() => {
                    //on mount purchaseType
                    client
                        .service("purchaseType")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singlePurchaseTypeId } })
                        .then((res) => {
                            setPurchaseType(res.data.map((e) => { return { name: e['name'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "PurchaseType", type: "error", message: error.message || "Failed get purchaseType" });
                        });
                }, []);
 useEffect(() => {
                    //on mount categories
                    client
                        .service("categories")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleCategoriesId } })
                        .then((res) => {
                            setCategoryId(res.data.map((e) => { return { name: e['name'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Categories", type: "error", message: error.message || "Failed get categories" });
                        });
                }, []);

    const onSave = async () => {
        let _data = {
            branchId: _entity?.branchId?._id,
vendorId: _entity?.vendorId?._id,
warehouseId: _entity?.warehouseId?._id,
purchaseType: _entity?.purchaseType?._id,
date: _entity?.date,
status: _entity?.status,
categoryId: _entity?.categoryId?._id,
purchaseId: _entity?.purchaseId,
        };

        setLoading(true);
        try {
            
        await client.service("purchase").patch(_entity._id, _data);
        const eagerResult = await client
            .service("purchase")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[_entity._id]}, $populate : [
                {
                    path : "branchId",
                    service : "branches",
                    select:["name"]},{
                    path : "vendorId",
                    service : "vendors",
                    select:["name"]},{
                    path : "warehouseId",
                    service : "warehouses",
                    select:["name"]},{
                    path : "purchaseType",
                    service : "purchaseType",
                    select:["name"]},{
                    path : "categoryId",
                    service : "categories",
                    select:["name"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Edit info", message: "Info purchase updated successfully" });
        props.onEditResult(eagerResult.data[0]);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to update info");
            props.alert({ type: "error", title: "Edit info", message: "Failed to update info" });
        }
        setLoading(false);
    };

    const renderFooter = () => (
        <div className="flex justify-content-end">
            <Button label="save" className="p-button-text no-focus-effect" onClick={onSave} loading={loading} />
            <Button label="close" className="p-button-text no-focus-effect p-button-secondary" onClick={props.onHide} />
        </div>
    );

    const setValByKey = (key, val) => {
        let new_entity = { ..._entity, [key]: val };
        set_entity(new_entity);
        setError({});
    };

    const branchIdOptions = branchId.map((elem) => ({ name: elem.name, value: elem.value }));
const vendorIdOptions = vendorId.map((elem) => ({ name: elem.name, value: elem.value }));
const warehouseIdOptions = warehouseId.map((elem) => ({ name: elem.name, value: elem.value }));
const purchaseTypeOptions = purchaseType.map((elem) => ({ name: elem.name, value: elem.value }));
const categoryIdOptions = categoryId.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Edit Purchase" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="purchase-edit-dialog-component">
                <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="branchId">Branch:</label>
                <Dropdown id="branchId" value={_entity?.branchId?._id} optionLabel="name" optionValue="value" options={branchIdOptions} onChange={(e) => setValByKey("branchId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["branchId"]) && (
              <p className="m-0" key="error-branchId">
                {error["branchId"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="vendorId">Vendor:</label>
                <Dropdown id="vendorId" value={_entity?.vendorId?._id} optionLabel="name" optionValue="value" options={vendorIdOptions} onChange={(e) => setValByKey("vendorId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["vendorId"]) && (
              <p className="m-0" key="error-vendorId">
                {error["vendorId"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="warehouseId">Warehouse:</label>
                <Dropdown id="warehouseId" value={_entity?.warehouseId?._id} optionLabel="name" optionValue="value" options={warehouseIdOptions} onChange={(e) => setValByKey("warehouseId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["warehouseId"]) && (
              <p className="m-0" key="error-warehouseId">
                {error["warehouseId"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="purchaseType">Purchase Type:</label>
                <Dropdown id="purchaseType" value={_entity?.purchaseType?._id} optionLabel="name" optionValue="value" options={purchaseTypeOptions} onChange={(e) => setValByKey("purchaseType", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["purchaseType"]) && (
              <p className="m-0" key="error-purchaseType">
                {error["purchaseType"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="date">date:</label>
                <Calendar id="date" value={_entity?.date ? new Date(_entity?.date) : new Date()} onChange={ (e) => setValByKey("date", e.value)} showTime hourFormat="24"  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["date"]) && (
              <p className="m-0" key="error-date">
                {error["date"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="status">status:</label>
                <Dropdown id="status" value={_entity?.status} options={statusOptions} optionLabel="name" optionValue="value" onChange={(e) => setValByKey("status", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["status"]) && (
              <p className="m-0" key="error-status">
                {error["status"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="categoryId">Category:</label>
                <Dropdown id="categoryId" value={_entity?.categoryId?._id} optionLabel="name" optionValue="value" options={categoryIdOptions} onChange={(e) => setValByKey("categoryId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["categoryId"]) && (
              <p className="m-0" key="error-categoryId">
                {error["categoryId"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="purchaseId">Purchase ID:</label>
                <InputNumber id="purchaseId" className="w-full mb-3 p-inputtext-sm" value={_entity?.purchaseId} onChange={(e) => setValByKey("purchaseId", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["purchaseId"]) && (
              <p className="m-0" key="error-purchaseId">
                {error["purchaseId"]}
              </p>
            )}
          </small>
            </div>
                <div className="col-12">&nbsp;</div>
                <small className="p-error">
                {Array.isArray(Object.keys(error))
                ? Object.keys(error).map((e, i) => (
                    <p className="m-0" key={i}>
                        {e}: {error[e]}
                    </p>
                    ))
                : error}
            </small>
            </div>
        </Dialog>
    );
};

const mapState = (state) => {
    const { user } = state.auth;
    return { user };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(PurchaseCreateDialogComponent);
