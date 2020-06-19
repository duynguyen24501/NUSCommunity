import React from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, message, Row, Col } from "antd";
import icon from "../assets/favicon.ico";
import "./Register.css";


const Register = () => {
  // 注册账号数据处理
  const onFinish = (values) => {
    console.log(values);
    message.success("register success~");
    window.location.href = "/login";
  };


  return (
    <div style={{ paddingTop: 36 }}>
      <div className="register">
        <Row gutter={16}>
          <Col span={6}>
            <div className="register-left">
              <img className="register-left-img" src={icon} alt="" />
              <Link className="register-left-btn" to="/login">
                Login
              </Link>
            </div>
          </Col>
          <Col span={18}>
            <div className="register-right">
              <div className="register-right-title">Sign up form</div>
              <Form
                name="normal_register"
                className="register-right-form"
                onFinish={onFinish}
                action="auth/sign-up"
                method="POST"
              >
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a valid NUS email!",
                    },
                  ]}
                >
                  <Input placeholder="NUS email" name="email" addonAfter="@u.nus.edu" />
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
                  <Input type="password" name="password" placeholder="Password" />
                </Form.Item>
                <Form.Item
                  name="confirm"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Please input your password again！",
                    },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        // eslint-disable-next-line prefer-promise-reject-errors
                        return Promise.reject(
                          "The confirm password does not match with the password!"
                        );
                      },
                    }),
                  ]}
                >
                  <Input type="password" placeholder="Confirm Password" />
                </Form.Item>
                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Do not leave username blank!",
                    },
                  ]}
                >
                  <Input placeholder="Username" type="text" name="username" />
                </Form.Item>
                <Form.Item>
                  <Button
                    htmlType="submit"
                    type="primary"
                    className="register-right-form-button"
                    ghost
                    size="large"
                  >
                    Register
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Register;
