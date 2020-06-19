import React from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, message, Row, Col } from "antd";
import icon from "../assets/favicon.ico";
import "../css/Reset.css";

const Reset = () => {
  const onFinish = (values) => {
    console.log(values);
    alert("A verification link has been sent to your email");
    window.location.href = "/login";
  };

  return (
    <div style={{ paddingTop: 36 }}>
      <div className="reset">
        <Row gutter={16}>
          <Col span={6}>
            <div className="reset-left">
              <img className="reset-left-img" src={icon} alt="" />
              <Link className="reset-left-btn" to="/login">
                Login
              </Link>
            </div>
          </Col>
          <Col span={18}>
            <div className="reset-right">
              <div className="reset-right-title">Reset Password Form</div>
              <Form
                name="normal_reset"
                className="reset-right-form"
                onFinish={onFinish}
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
                  <Input placeholder="NUS email" addonAfter="@u.nus.edu" />
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
                  <Input type="password" placeholder="New Password" />
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
                  <Input type="password" placeholder="Confirm New Password" />
                </Form.Item>
                <Form.Item>
                  <Button
                    htmlType="submit"
                    type="primary"
                    className="reset-right-form-button"
                    ghost
                    size="large"
                  >
                    Reset
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

export default Reset;
