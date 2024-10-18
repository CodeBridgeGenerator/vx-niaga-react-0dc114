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
const statusArray = ["Created","Processing","Final","Cancel"];
const statusOptions = statusArray.map((x) => ({ name: x, value: x }));
const deliveryStatusArray = ["Ordered","Shipped","Delivered"];
const deliveryStatusOptions = deliveryStatusArray.map((x) => ({ name: x, value: x }));

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

const InvoicesCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [branchId, setBranchId] = useState([])
const [customerId, setCustomerId] = useState([])
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
                    //on mount customers
                    client
                        .service("customers")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleCustomersId } })
                        .then((res) => {
                            setCustomerId(res.data.map((e) => { return { name: e['name'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Customers", type: "error", message: error.message || "Failed get customers" });
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
customerId: _entity?.customerId?._id,
invoiceDate: _entity?.invoiceDate,
categoryId: _entity?.categoryId?._id,
status: _entity?.status,
source: _entity?.source,
deliveryStatus: _entity?.deliveryStatus,
description: _entity?.description,
invoiceId: _entity?.invoiceId,
        };

        setLoading(true);
        try {
            
        await client.service("invoices").patch(_entity._id, _data);
        const eagerResult = await client
            .service("invoices")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[_entity._id]}, $populate : [
                {
                    path : "branchId",
                    service : "branches",
                    select:["name"]},{
                    path : "customerId",
                    service : "customers",
                    select:["name"]},{
                    path : "categoryId",
                    service : "categories",
                    select:["name"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Edit info", message: "Info invoices updated successfully" });
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
const customerIdOptions = customerId.map((elem) => ({ name: elem.name, value: elem.value }));
const categoryIdOptions = categoryId.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Edit Invoices" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="invoices-edit-dialog-component">
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
                <label htmlFor="customerId">Customer:</label>
                <Dropdown id="customerId" value={_entity?.customerId?._id} optionLabel="name" optionValue="value" options={customerIdOptions} onChange={(e) => setValByKey("customerId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["customerId"]) && (
              <p className="m-0" key="error-customerId">
                {error["customerId"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="invoiceDate">invoice_date:</label>
                <Calendar id="invoiceDate" value={_entity?.invoiceDate ? new Date(_entity?.invoiceDate) : new Date()} onChange={ (e) => setValByKey("invoiceDate", e.value)} showTime hourFormat="24"  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["invoiceDate"]) && (
              <p className="m-0" key="error-invoiceDate">
                {error["invoiceDate"]}
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
                <label htmlFor="source">source:</label>
                <InputText id="source" className="w-full mb-3 p-inputtext-sm" value={_entity?.source} onChange={(e) => setValByKey("source", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["source"]) && (
              <p className="m-0" key="error-source">
                {error["source"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="deliveryStatus">Delivery Status:</label>
                <Dropdown id="deliveryStatus" value={_entity?.deliveryStatus} options={deliveryStatusOptions} optionLabel="name" optionValue="value" onChange={(e) => setValByKey("deliveryStatus", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["deliveryStatus"]) && (
              <p className="m-0" key="error-deliveryStatus">
                {error["deliveryStatus"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="description">description:</label>
                <InputText id="description" className="w-full mb-3 p-inputtext-sm" value={_entity?.description} onChange={(e) => setValByKey("description", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["description"]) && (
              <p className="m-0" key="error-description">
                {error["description"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="invoiceId">Invoice ID:</label>
                <InputNumber id="invoiceId" className="w-full mb-3 p-inputtext-sm" value={_entity?.invoiceId} onChange={(e) => setValByKey("invoiceId", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["invoiceId"]) && (
              <p className="m-0" key="error-invoiceId">
                {error["invoiceId"]}
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

export default connect(mapState, mapDispatch)(InvoicesCreateDialogComponent);
