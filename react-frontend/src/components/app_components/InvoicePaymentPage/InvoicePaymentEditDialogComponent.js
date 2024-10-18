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
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';


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

const InvoicePaymentCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [branchId, setBranchId] = useState([])
const [invoiceId, setInvoiceId] = useState([])

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
                    //on mount invoices
                    client
                        .service("invoices")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleInvoicesId } })
                        .then((res) => {
                            setInvoiceId(res.data.map((e) => { return { name: e['invoiceId'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Invoices", type: "error", message: error.message || "Failed get invoices" });
                        });
                }, []);

    const onSave = async () => {
        let _data = {
            branchId: _entity?.branchId?._id,
invoiceId: _entity?.invoiceId?._id,
date: _entity?.date,
amount: _entity?.amount,
accountId: _entity?.accountId,
paymentMethod: _entity?.paymentMethod,
reference: _entity?.reference,
description: _entity?.description,
receiptPath: _entity?.receiptPath,
        };

        setLoading(true);
        try {
            
        await client.service("invoicePayment").patch(_entity._id, _data);
        const eagerResult = await client
            .service("invoicePayment")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[_entity._id]}, $populate : [
                {
                    path : "branchId",
                    service : "branches",
                    select:["name"]},{
                    path : "invoiceId",
                    service : "invoices",
                    select:["invoiceId"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Edit info", message: "Info invoicePayment updated successfully" });
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
const invoiceIdOptions = invoiceId.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Edit Invoice Payment" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="invoicePayment-edit-dialog-component">
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
                <label htmlFor="invoiceId">Invoice:</label>
                <Dropdown id="invoiceId" value={_entity?.invoiceId?._id} optionLabel="name" optionValue="value" options={invoiceIdOptions} onChange={(e) => setValByKey("invoiceId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["invoiceId"]) && (
              <p className="m-0" key="error-invoiceId">
                {error["invoiceId"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="date">date:</label>
                <InputNumber id="date" className="w-full mb-3 p-inputtext-sm" value={_entity?.date} onChange={(e) => setValByKey("date", e.value)}  />
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
                <label htmlFor="amount">amount:</label>
                <InputNumber id="amount" className="w-full mb-3 p-inputtext-sm" value={_entity?.amount} onChange={(e) => setValByKey("amount", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["amount"]) && (
              <p className="m-0" key="error-amount">
                {error["amount"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="accountId">account_id:</label>
                <InputNumber id="accountId" className="w-full mb-3 p-inputtext-sm" value={_entity?.accountId} onChange={(e) => setValByKey("accountId", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["accountId"]) && (
              <p className="m-0" key="error-accountId">
                {error["accountId"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="paymentMethod">payment_method:</label>
                <InputText id="paymentMethod" className="w-full mb-3 p-inputtext-sm" value={_entity?.paymentMethod} onChange={(e) => setValByKey("paymentMethod", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["paymentMethod"]) && (
              <p className="m-0" key="error-paymentMethod">
                {error["paymentMethod"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="reference">reference:</label>
                <InputText id="reference" className="w-full mb-3 p-inputtext-sm" value={_entity?.reference} onChange={(e) => setValByKey("reference", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["reference"]) && (
              <p className="m-0" key="error-reference">
                {error["reference"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="description">description:</label>
                <InputTextarea id="description" rows={5} cols={30} value={_entity?.description} onChange={ (e) => setValByKey("description", e.target.value)} autoResize  />
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
                <label htmlFor="receiptPath">receipt_path:</label>
                <InputText id="receiptPath" className="w-full mb-3 p-inputtext-sm" value={_entity?.receiptPath} onChange={(e) => setValByKey("receiptPath", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["receiptPath"]) && (
              <p className="m-0" key="error-receiptPath">
                {error["receiptPath"]}
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

export default connect(mapState, mapDispatch)(InvoicePaymentCreateDialogComponent);
