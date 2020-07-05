import React from "react";
import { Link } from "react-router-dom";
import {
  // UserOutlined,
  ArrowLeftOutlined,
  LockOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Form } from "antd";
import BraftEditor from "braft-editor";
import "braft-editor/dist/index.css";
import "./index.css";
import "./index.css";

export default class Profile extends React.Component {
  formRef = React.createRef();
  state = {
    info: {
      name: "abc",
      email: "e12398132@u.nus.edu",
      bio: "",
    },
  };

  onFinish = (values) => {
    // console.log(values);
  };

  render() {
    const { history } = this.props;
    const { info } = this.state;
    return (
      <div className="profile">
        <div className="profile-center">
          <div
            onClick={() => {
              history.goBack();
            }}
            className="profile-center-back"
          >
            <ArrowLeftOutlined className="mr-8" />
            Back
          </div>
          <Link className="profile-center-reset" to="/reset">
            <LockOutlined className="mr-8" />
            Change Password
          </Link>
          <div className="profile-center-del">
            <DeleteOutlined className="mr-8" />
            Delete Account
          </div>
        </div>
        <div className="profile-con">
          <div className="profile-con-title">Edit Profile</div>
          <Form
            name="normal_add"
            ref={this.formRef}
            onFinish={this.onFinish}
            className="profile-con-form"
            initialValues={{
              bio: BraftEditor.createEditorState(info.bio),
            }}
          >
            <div className="profile-con-form-label">Name</div>
            <Form.Item>{info.name}</Form.Item>
            <div className="profile-con-form-label">Email</div>
            <Form.Item>{info.email}</Form.Item>
            <div className="profile-con-form-label">Bio</div>
            <Form.Item
              name="bio"
              validateTrigger="onBlur"
              rules={[
                {
                  validator(rule, value) {
                    if (value.isEmpty()) {
                      return Promise.reject("please enter your summary");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <BraftEditor language="en" className="my-editor" />
            </Form.Item>
            <div
              onClick={() => {
                this.formRef.current.submit();
              }}
              className="profile-con-form-btn"
            >
              Save
            </div>
          </Form>
        </div>
      </div>
    );
  }
}
