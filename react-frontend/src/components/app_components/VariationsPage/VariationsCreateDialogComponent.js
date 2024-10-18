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
import UploadFilesToS3 from "../../../services/UploadFilesToS3";


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

const VariationsCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [branchId, setBranchId] = useState([])
const [productId, setProductId] = useState([])

    useEffect(() => {
        let init  = {};
        if (!_.isEmpty(props?.entity)) {
            init = initilization({ ...props?.entity, ...init }, [branchId,productId], setError);
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
            branchId: _entity?.branchId?._id,productId: _entity?.productId?._id,name: _entity?.name,subSku: _entity?.subSku,purchasePrice: _entity?.purchasePrice,sellPrice: _entity?.sellPrice,imagePath: _entity?.imagePath,
            createdBy: props.user._id,
            updatedBy: props.user._id
        };

        setLoading(true);

        try {
            
        const result = await client.service("variations").create(_data);
        const eagerResult = await client
            .service("variations")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[result._id]}, $populate : [
                {
                    path : "branchId",
                    service : "branches",
                    select:["name"]},{
                    path : "productId",
                    service : "productServices",
                    select:["name"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Create info", message: "Info Variations updated successfully" });
        props.onCreateResult(eagerResult.data[0]);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create in Variations" });
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

useEffect(() => {
                    // on mount productServices
                    client
                        .service("productServices")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleProductServicesId } })
                        .then((res) => {
                            setProductId(res.data.map((e) => { return { name: e['name'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "ProductServices", type: "error", message: error.message || "Failed get productServices" });
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
const productIdOptions = productId.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Create Variations" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="variations-create-dialog-component">
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
                <label htmlFor="productId">Product:</label>
                <Dropdown id="productId" value={_entity?.productId?._id} optionLabel="name" optionValue="value" options={productIdOptions} onChange={(e) => setValByKey("productId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["productId"]) ? (
              <p className="m-0" key="error-productId">
                {error["productId"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="name">name:</label>
                <InputText id="name" className="w-full mb-3 p-inputtext-sm" value={_entity?.name} onChange={(e) => setValByKey("name", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["name"]) ? (
              <p className="m-0" key="error-name">
                {error["name"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="subSku">sub_sku:</label>
                <InputText id="subSku" className="w-full mb-3 p-inputtext-sm" value={_entity?.subSku} onChange={(e) => setValByKey("subSku", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["subSku"]) ? (
              <p className="m-0" key="error-subSku">
                {error["subSku"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="purchasePrice">purchase_price:</label>
                <InputText id="purchasePrice" className="w-full mb-3 p-inputtext-sm" value={_entity?.purchasePrice} onChange={(e) => setValByKey("purchasePrice", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["purchasePrice"]) ? (
              <p className="m-0" key="error-purchasePrice">
                {error["purchasePrice"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="sellPrice">sell_price:</label>
                <InputNumber id="sellPrice" className="w-full mb-3 p-inputtext-sm" value={_entity?.sellPrice} onChange={(e) => setValByKey("sellPrice", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["sellPrice"]) ? (
              <p className="m-0" key="error-sellPrice">
                {error["sellPrice"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 field">
                <span className="align-items-center">
                    <label htmlFor="imagePath">image_path:</label>
                    <UploadFilesToS3 type={'create'} setValByKey={setValByKey} onSave={onSave} id={urlParams.singleVariationsId} serviceName="variations" />
                </span>
                <small className="p-error">
                {!_.isEmpty(error["imagePath"]) ? (
                  <p className="m-0" key="error-imagePath">
                    {error["imagePath"]}
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

export default connect(mapState, mapDispatch)(VariationsCreateDialogComponent);
