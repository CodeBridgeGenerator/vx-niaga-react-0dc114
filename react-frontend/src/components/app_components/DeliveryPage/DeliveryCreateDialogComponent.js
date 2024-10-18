import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import initilization from "../../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import UploadFilesToS3 from "../../../services/UploadFilesToS3";
import { Calendar } from "primereact/calendar";
const deliveryStatusArray = ["Ordered","Shipped","Delivered"];
const deliveryStatusOptions = deliveryStatusArray.map((x) => ({ name: x, value: x }));

const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = {};
    for (const key in errorObj.errors) {
      if (Object.hasOwnProperty.call(errorObj.errors, key)) {
        const element = errorObj.errors[key];
        if (element?.message) {
          errMsg[key] = element.message;
        }
      }
    }
    return errMsg.length ? errMsg : errorObj.message ? { error : errorObj.message} : {};
};

const DeliveryCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [branchId, setBranchId] = useState([])

    useEffect(() => {
        let init  = {};
        if (!_.isEmpty(props?.entity)) {
            init = initilization({ ...props?.entity, ...init }, [branchId], setError);
        }
        set_entity({...init});
    }, [props.show]);

    const validate = () => {
        let ret = true;
        const error = {};
        
        if (!ret) setError(error);
        return ret;
    }

    const onSave = async () => {
        if(!validate()) return;
        let _data = {
            branchId: _entity?.branchId?._id,modelType: _entity?.modelType,modelId: _entity?.modelId,deliveryAddress: _entity?.deliveryAddress,receiverName: _entity?.receiverName,receiverPhone: _entity?.receiverPhone,attachmentPath: _entity?.attachmentPath,deliveryMethod: _entity?.deliveryMethod,deliveryNote: _entity?.deliveryNote,deliveryStatus: _entity?.deliveryStatus,consignmentNo: _entity?.consignmentNo,consignmentBy: _entity?.consignmentBy,deliveryDate: _entity?.deliveryDate,
            createdBy: props.user._id,
            updatedBy: props.user._id
        };

        setLoading(true);

        try {
            
        const result = await client.service("delivery").create(_data);
        const eagerResult = await client
            .service("delivery")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[result._id]}, $populate : [
                {
                    path : "branchId",
                    service : "branches",
                    select:["name"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Create info", message: "Info Delivery updated successfully" });
        props.onCreateResult(eagerResult.data[0]);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create in Delivery" });
        }
        setLoading(false);
    };

    useEffect(() => {
                    // on mount branches
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

    return (
        <Dialog header="Create Delivery" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="delivery-create-dialog-component">
            <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="branchId">Branch:</label>
                <Dropdown id="branchId" value={_entity?.branchId?._id} optionLabel="name" optionValue="value" options={branchIdOptions} onChange={(e) => setValByKey("branchId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["branchId"]) ? (
              <p className="m-0" key="error-branchId">
                {error["branchId"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="modelType">model_type:</label>
                <InputText id="modelType" className="w-full mb-3 p-inputtext-sm" value={_entity?.modelType} onChange={(e) => setValByKey("modelType", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["modelType"]) ? (
              <p className="m-0" key="error-modelType">
                {error["modelType"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="modelId">model_id:</label>
                <InputNumber id="modelId" className="w-full mb-3 p-inputtext-sm" value={_entity?.modelId} onChange={(e) => setValByKey("modelId", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["modelId"]) ? (
              <p className="m-0" key="error-modelId">
                {error["modelId"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="deliveryAddress">delivery_address:</label>
                <InputTextarea id="deliveryAddress" rows={5} cols={30} value={_entity?.deliveryAddress} onChange={ (e) => setValByKey("deliveryAddress", e.target.value)} autoResize  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["deliveryAddress"]) ? (
              <p className="m-0" key="error-deliveryAddress">
                {error["deliveryAddress"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="receiverName">receiver_name:</label>
                <InputText id="receiverName" className="w-full mb-3 p-inputtext-sm" value={_entity?.receiverName} onChange={(e) => setValByKey("receiverName", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["receiverName"]) ? (
              <p className="m-0" key="error-receiverName">
                {error["receiverName"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="receiverPhone">receiver_phone:</label>
                <InputText id="receiverPhone" className="w-full mb-3 p-inputtext-sm" value={_entity?.receiverPhone} onChange={(e) => setValByKey("receiverPhone", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["receiverPhone"]) ? (
              <p className="m-0" key="error-receiverPhone">
                {error["receiverPhone"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 field">
                <span className="align-items-center">
                    <label htmlFor="attachmentPath">attachment_path:</label>
                    <UploadFilesToS3 type={'create'} setValByKey={setValByKey} onSave={onSave} id={urlParams.singleDeliveryId} serviceName="delivery" />
                </span>
                <small className="p-error">
                {!_.isEmpty(error["attachmentPath"]) ? (
                  <p className="m-0" key="error-attachmentPath">
                    {error["attachmentPath"]}
                  </p>
                ) : null}
              </small>
                </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="deliveryMethod">delivery_method:</label>
                <InputText id="deliveryMethod" className="w-full mb-3 p-inputtext-sm" value={_entity?.deliveryMethod} onChange={(e) => setValByKey("deliveryMethod", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["deliveryMethod"]) ? (
              <p className="m-0" key="error-deliveryMethod">
                {error["deliveryMethod"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="deliveryNote">delivery_note:</label>
                <InputText id="deliveryNote" className="w-full mb-3 p-inputtext-sm" value={_entity?.deliveryNote} onChange={(e) => setValByKey("deliveryNote", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["deliveryNote"]) ? (
              <p className="m-0" key="error-deliveryNote">
                {error["deliveryNote"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="deliveryStatus">delivery_status:</label>
                <Dropdown id="deliveryStatus" value={_entity?.deliveryStatus} options={deliveryStatusOptions} optionLabel="name" optionValue="value" onChange={(e) => setValByKey("deliveryStatus", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["deliveryStatus"]) ? (
              <p className="m-0" key="error-deliveryStatus">
                {error["deliveryStatus"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="consignmentNo">consignment_no:</label>
                <InputText id="consignmentNo" className="w-full mb-3 p-inputtext-sm" value={_entity?.consignmentNo} onChange={(e) => setValByKey("consignmentNo", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["consignmentNo"]) ? (
              <p className="m-0" key="error-consignmentNo">
                {error["consignmentNo"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="consignmentBy">consignment_by:</label>
                <InputText id="consignmentBy" className="w-full mb-3 p-inputtext-sm" value={_entity?.consignmentBy} onChange={(e) => setValByKey("consignmentBy", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["consignmentBy"]) ? (
              <p className="m-0" key="error-consignmentBy">
                {error["consignmentBy"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="deliveryDate">delivery_date:</label>
                <Calendar id="deliveryDate" value={_entity?.deliveryDate ? new Date(_entity?.deliveryDate) : new Date()} onChange={ (e) => setValByKey("deliveryDate", e.value)} showTime hourFormat="24"  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["deliveryDate"]) ? (
              <p className="m-0" key="error-deliveryDate">
                {error["deliveryDate"]}
              </p>
            ) : null}
          </small>
            </div>
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

export default connect(mapState, mapDispatch)(DeliveryCreateDialogComponent);
