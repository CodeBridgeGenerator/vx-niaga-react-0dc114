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

const PurchaseProductCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [branchId, setBranchId] = useState([])
const [purchaseId, setPurchaseId] = useState([])
const [productId, setProductId] = useState([])
const [variationId, setVariationId] = useState([])

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
                    //on mount purchase
                    client
                        .service("purchase")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singlePurchaseId } })
                        .then((res) => {
                            setPurchaseId(res.data.map((e) => { return { name: e['purchaseId'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Purchase", type: "error", message: error.message || "Failed get purchase" });
                        });
                }, []);
 useEffect(() => {
                    //on mount productServices
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
 useEffect(() => {
                    //on mount variations
                    client
                        .service("variations")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleVariationsId } })
                        .then((res) => {
                            setVariationId(res.data.map((e) => { return { name: e['name'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Variations", type: "error", message: error.message || "Failed get variations" });
                        });
                }, []);

    const onSave = async () => {
        let _data = {
            branchId: _entity?.branchId?._id,
purchaseId: _entity?.purchaseId?._id,
productId: _entity?.productId?._id,
variationId: _entity?.variationId?._id,
quantity: _entity?.quantity,
price: _entity?.price,
tax: _entity?.tax,
discount: _entity?.discount,
        };

        setLoading(true);
        try {
            
        await client.service("purchaseProduct").patch(_entity._id, _data);
        const eagerResult = await client
            .service("purchaseProduct")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[_entity._id]}, $populate : [
                {
                    path : "branchId",
                    service : "branches",
                    select:["name"]},{
                    path : "purchaseId",
                    service : "purchase",
                    select:["purchaseId"]},{
                    path : "productId",
                    service : "productServices",
                    select:["name"]},{
                    path : "variationId",
                    service : "variations",
                    select:["name"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Edit info", message: "Info purchaseProduct updated successfully" });
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
const purchaseIdOptions = purchaseId.map((elem) => ({ name: elem.name, value: elem.value }));
const productIdOptions = productId.map((elem) => ({ name: elem.name, value: elem.value }));
const variationIdOptions = variationId.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Edit Purchase Product" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="purchaseProduct-edit-dialog-component">
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
                <label htmlFor="purchaseId">Purchase:</label>
                <Dropdown id="purchaseId" value={_entity?.purchaseId?._id} optionLabel="name" optionValue="value" options={purchaseIdOptions} onChange={(e) => setValByKey("purchaseId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["purchaseId"]) && (
              <p className="m-0" key="error-purchaseId">
                {error["purchaseId"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="productId">Product:</label>
                <Dropdown id="productId" value={_entity?.productId?._id} optionLabel="name" optionValue="value" options={productIdOptions} onChange={(e) => setValByKey("productId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["productId"]) && (
              <p className="m-0" key="error-productId">
                {error["productId"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="variationId">Variation:</label>
                <Dropdown id="variationId" value={_entity?.variationId?._id} optionLabel="name" optionValue="value" options={variationIdOptions} onChange={(e) => setValByKey("variationId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["variationId"]) && (
              <p className="m-0" key="error-variationId">
                {error["variationId"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="quantity">quantity:</label>
                <InputNumber id="quantity" className="w-full mb-3 p-inputtext-sm" value={_entity?.quantity} onChange={(e) => setValByKey("quantity", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["quantity"]) && (
              <p className="m-0" key="error-quantity">
                {error["quantity"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="price">price:</label>
                <InputNumber id="price" className="w-full mb-3 p-inputtext-sm" value={_entity?.price} onChange={(e) => setValByKey("price", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["price"]) && (
              <p className="m-0" key="error-price">
                {error["price"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="tax">tax:</label>
                <InputNumber id="tax" className="w-full mb-3 p-inputtext-sm" value={_entity?.tax} onChange={(e) => setValByKey("tax", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["tax"]) && (
              <p className="m-0" key="error-tax">
                {error["tax"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="discount">discount:</label>
                <InputNumber id="discount" className="w-full mb-3 p-inputtext-sm" value={_entity?.discount} onChange={(e) => setValByKey("discount", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["discount"]) && (
              <p className="m-0" key="error-discount">
                {error["discount"]}
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

export default connect(mapState, mapDispatch)(PurchaseProductCreateDialogComponent);
