import React from "react";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  ArrowLeftOutlined,
  LockOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Form, Input } from "antd";
import BraftEditor from "braft-editor";
import "braft-editor/dist/index.css";
import "./index.css";
import "./index.css";

export default class Profile extends React.Component {
  formRef = React.createRef();

  render() {
    const { history } = this.props;
    return (
      <div className="profile">
        <div className="profile-bar">
          <h1>
            <UserOutlined className="mr-8" />
            Edit Profile
          </h1>
        </div>
        <div className="profile-center">
          <div
            onClick={() => {
              history.goBack();
            }}
            className="profile-center-back"
          >
            <ArrowLeftOutlined className="mr-8" />
            Back To Dashboard
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
            className="profile-con-form"
          >
            <div className="profile-con-form-label">Name</div>
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: "please enter your name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <div className="profile-con-form-label">Email</div>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "please enter your email!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <div className="profile-con-form-label">Bio</div>
            <Form.Item
              name="msg"
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
          </Form>
        </div>
      </div>
    );
  }
}
