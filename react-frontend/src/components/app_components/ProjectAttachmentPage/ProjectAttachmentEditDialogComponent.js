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
import UploadFilesToS3 from "../../../services/UploadFilesToS3";


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

const ProjectAttachmentCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [projectId, setProjectId] = useState([])

    useEffect(() => {
        set_entity(props.entity);
    }, [props.entity, props.show]);

     useEffect(() => {
                    //on mount project
                    client
                        .service("project")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleProjectId } })
                        .then((res) => {
                            setProjectId(res.data.map((e) => { return { name: e['title'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Project", type: "error", message: error.message || "Failed get project" });
                        });
                }, []);

    const onSave = async () => {
        let _data = {
            projectId: _entity?.projectId?._id,
fileName: _entity?.fileName,
filePath: _entity?.filePath,
        };

        setLoading(true);
        try {
            
        await client.service("projectAttachment").patch(_entity._id, _data);
        const eagerResult = await client
            .service("projectAttachment")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[_entity._id]}, $populate : [
                {
                    path : "projectId",
                    service : "project",
                    select:["title"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Edit info", message: "Info projectAttachment updated successfully" });
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

    const projectIdOptions = projectId.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Edit Project Attachment" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="projectAttachment-edit-dialog-component">
                <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="projectId">Project:</label>
                <Dropdown id="projectId" value={_entity?.projectId?._id} optionLabel="name" optionValue="value" options={projectIdOptions} onChange={(e) => setValByKey("projectId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["projectId"]) && (
              <p className="m-0" key="error-projectId">
                {error["projectId"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="fileName">file_name:</label>
                <InputText id="fileName" className="w-full mb-3 p-inputtext-sm" value={_entity?.fileName} onChange={(e) => setValByKey("fileName", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["fileName"]) && (
              <p className="m-0" key="error-fileName">
                {error["fileName"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 field">
                <span className="align-items-center">
                    <label htmlFor="filePath">file_path:</label>
                    <UploadFilesToS3 type={'edit'} setValByKey={setValByKey} onSave={onSave} id={urlParams.singleProjectAttachmentId} serviceName="projectAttachment" />
                </span>
                <small className="p-error">
                {!_.isEmpty(error["filePath"]) && (
                  <p className="m-0" key="error-filePath">
                    {error["filePath"]}
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

export default connect(mapState, mapDispatch)(ProjectAttachmentCreateDialogComponent);
