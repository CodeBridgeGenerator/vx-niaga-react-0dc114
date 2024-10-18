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

const DeliveryDetailCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [deliveryId, setDeliveryId] = useState([])
const [productId, setProductId] = useState([])
const [variationId, setVariationId] = useState([])

    useEffect(() => {
        let init  = {};
        if (!_.isEmpty(props?.entity)) {
            init = initilization({ ...props?.entity, ...init }, [deliveryId,productId,variationId], setError);
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
            deliveryId: _entity?.deliveryId?._id,productId: _entity?.productId?._id,variationId: _entity?.variationId?._id,deliveredQty: _entity?.deliveredQty,
            createdBy: props.user._id,
            updatedBy: props.user._id
        };

        setLoading(true);

        try {
            
        const result = await client.service("deliveryDetail").create(_data);
        const eagerResult = await client
            .service("deliveryDetail")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[result._id]}, $populate : [
                {
                    path : "deliveryId",
                    service : "customers",
                    select:["name"]},{
                    path : "productId",
                    service : "productServices",
                    select:["name"]},{
                    path : "variationId",
                    service : "variations",
                    select:["name"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Create info", message: "Info Delivery Detail updated successfully" });
        props.onCreateResult(eagerResult.data[0]);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create in Delivery Detail" });
        }
        setLoading(false);
    };

    useEffect(() => {
                    // on mount customers
                    client
                        .service("customers")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleCustomersId } })
                        .then((res) => {
                            setDeliveryId(res.data.map((e) => { return { name: e['name'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Customers", type: "error", message: error.message || "Failed get customers" });
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

useEffect(() => {
                    // on mount variations
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

    const deliveryIdOptions = deliveryId.map((elem) => ({ name: elem.name, value: elem.value }));
const productIdOptions = productId.map((elem) => ({ name: elem.name, value: elem.value }));
const variationIdOptions = variationId.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Create Delivery Detail" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="deliveryDetail-create-dialog-component">
            <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="deliveryId">Delivery:</label>
                <Dropdown id="deliveryId" value={_entity?.deliveryId?._id} optionLabel="name" optionValue="value" options={deliveryIdOptions} onChange={(e) => setValByKey("deliveryId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["deliveryId"]) ? (
              <p className="m-0" key="error-deliveryId">
                {error["deliveryId"]}
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
                <label htmlFor="variationId">variation_id:</label>
                <Dropdown id="variationId" value={_entity?.variationId?._id} optionLabel="name" optionValue="value" options={variationIdOptions} onChange={(e) => setValByKey("variationId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["variationId"]) ? (
              <p className="m-0" key="error-variationId">
                {error["variationId"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="deliveredQty">delivered_qty:</label>
                <InputNumber id="deliveredQty" className="w-full mb-3 p-inputtext-sm" value={_entity?.deliveredQty} onChange={(e) => setValByKey("deliveredQty", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["deliveredQty"]) ? (
              <p className="m-0" key="error-deliveredQty">
                {error["deliveredQty"]}
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

export default connect(mapState, mapDispatch)(DeliveryDetailCreateDialogComponent);
