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


const SingleDeliveryDetailPage = (props) => {
    const navigate = useNavigate();
    const urlParams = useParams();
    const [_entity, set_entity] = useState();
  const [isHelpSidebarVisible, setHelpSidebarVisible] = useState(false);

    const [deliveryId, setDeliveryId] = useState([]);
const [productId, setProductId] = useState([]);
const [variationId, setVariationId] = useState([]);

    useEffect(() => {
        //on mount
        client
            .service("deliveryDetail")
            .get(urlParams.singleDeliveryDetailId, { query: { $populate: [            {
                path: "createdBy",
                service: "users",
                select: ["name"],
              },{
                path: "updatedBy",
                service: "users",
                select: ["name"],
              },"deliveryId","productId","variationId"] }})
            .then((res) => {
                set_entity(res || {});
                const deliveryId = Array.isArray(res.deliveryId)
            ? res.deliveryId.map((elem) => ({ _id: elem._id, name: elem.name }))
            : res.deliveryId
                ? [{ _id: res.deliveryId._id, name: res.deliveryId.name }]
                : [];
        setDeliveryId(deliveryId);
const productId = Array.isArray(res.productId)
            ? res.productId.map((elem) => ({ _id: elem._id, name: elem.name }))
            : res.productId
                ? [{ _id: res.productId._id, name: res.productId.name }]
                : [];
        setProductId(productId);
const variationId = Array.isArray(res.variationId)
            ? res.variationId.map((elem) => ({ _id: elem._id, name: elem.name }))
            : res.variationId
                ? [{ _id: res.variationId._id, name: res.variationId.name }]
                : [];
        setVariationId(variationId);
            })
            .catch((error) => {
                console.log({ error });
                props.alert({ title: "DeliveryDetail", type: "error", message: error.message || "Failed get deliveryDetail" });
            });
    }, [props,urlParams.singleDeliveryDetailId]);


    const goBack = () => {
        navigate("/deliveryDetail");
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
                    <h3 className="m-0">Delivery Detail</h3>
                    <SplitButton
                        model={menuItems.filter(
                        (m) => !(m.icon === "pi pi-trash" && items?.length === 0),
                        )}
                        dropdownIcon="pi pi-ellipsis-h"
                        buttonClassName="hidden"
                        menuButtonClassName="ml-1 p-button-text"
                    />
                </div>
                
                {/* <p>deliveryDetail/{urlParams.singleDeliveryDetailId}</p> */}
            </div>
            <div className="card w-full">
                <div className="grid ">

            <div className="col-12 md:col-6 lg:col-3 mb-10"><label className="text-sm text-gray-600">delivered_qty</label><p className="m-0 ml-3" >{Number(_entity?.deliveredQty)}</p></div>
            <div className="col-12 md:col-6 lg:col-3 mb-10"><label className="text-sm text-gray-600">Delivery</label>
                    {deliveryId.map((elem) => (
                        <Link key={elem._id} to={`/customers/${elem._id}`}>
                        <div>
                  {" "}
                            <p className="text-xl text-primary">{elem.name}</p>
                            </div>
                        </Link>
                    ))}</div>
<div className="col-12 md:col-6 lg:col-3 mb-10"><label className="text-sm text-gray-600">Product</label>
                    {productId.map((elem) => (
                        <Link key={elem._id} to={`/productServices/${elem._id}`}>
                        <div>
                  {" "}
                            <p className="text-xl text-primary">{elem.name}</p>
                            </div>
                        </Link>
                    ))}</div>
<div className="col-12 md:col-6 lg:col-3 mb-10"><label className="text-sm text-gray-600">variation_id</label>
                    {variationId.map((elem) => (
                        <Link key={elem._id} to={`/variations/${elem._id}`}>
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
                
            </TabView>
        </div>

      <CommentsSection
        recordId={urlParams.singleDeliveryDetailId}
        user={props.user}
        alert={props.alert}
        serviceName="deliveryDetail"
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

export default connect(mapState, mapDispatch)(SingleDeliveryDetailPage);
