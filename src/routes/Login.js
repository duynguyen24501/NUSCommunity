import React from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import icon from "../assets/favicon.ico";
import "../css/Login.css";

const Login = () => {
  const onFinish = (values) => {
    console.log(values);
    message.success("login success~");
    window.location.href = "/home";
  };

  return (
    <div style={{ paddingTop: 25 }}>
      <div className="login">
        <div className="login-title">Welcome to the NUSCommunity !</div>
        <div className="login-con">
          <img className="login-con-img" src={icon} alt="" />
          <div className="login-con-line" />
          <Form
            name="normal_login"
            className="login-con-form"
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please enter your email!",
                },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input type="password" placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Link className="login-con-form-reset" to="/reset">
                forgot password?
              </Link>
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                type="primary"
                className="login-con-form-btn"
                size="large"
              >
                SIGN IN
              </Button>
            </Form.Item>
            <Link className="login-con-form-register" to="/reg">
              REGISTER HERE
            </Link>
          </Form>
        </div>
      </div>
    </div>
  );
};
export default Login;
