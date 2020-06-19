import React from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, message, Row, Col } from "antd";
import icon from "../assets/favicon.ico";
import "./Register.css";
import Session from "../utils/session";
import Router from "next/router";

class Register extends React.Component {
  static async getInitialProps({ req, res }) {
    let props = {
      session: "",
    };

    if (req && req.session) {
      props.session = req.session;
    } else {
      props.session = await Session.getSession();
    }

    if (props.session && props.session.loggedin) {
      if (req) {
        res.redirect("/");
      } else {
        Router.push("/");
      }
    }

    return props;
  }

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      message: null,
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  handleEmailChange(event) {
    this.setState({
      email: event.target.value.trim(),
    });
  }

  handlePasswordChange(event) {
    this.setState({
      password: event.target.value.trim(),
    });
  }

  handleConfirmPasswordChange(event) {
    this.setState({
      confirmPassword: event.target.value.trim(),
    });
  }

  handleUsernameChange(event) {
    this.setState({
      username: event.target.value.trim(),
    });
  }

  handleSignUp(event) {
    console.log("event");
    //event.preventDefault();
    

    this.setState({
      message: null,
    });

    if (
      !this.state.email ||
      !this.state.password ||
      !this.state.confirmPassword
    ) {
      this.setState({
        message: "All fields are required!",
      });

      return;
    }

    if (this.state.password !== this.state.confirmPassword) {
      this.setState({
        message: "Password did not match!",
      });

      return;
    }

    let data = {
      email: this.state.email,
      password: this.state.password,
    };

    fetch("auth/sign-up", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.message) {
          this.setState({
            message: response.message,
          });
        } else if (response.email) {
          Router.push("/check-email?email=" + response.email);
        } else {
          this.setState({
            message: "Unknown Error!",
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        this.setState({
          message: "Request Failed!",
        });
      });
  }

  // 注册账号数据处理
  //   const onFinish = (values) => {
  //     console.log(values);
  //     message.success("register success~");
  //     window.location.href = "/login";
  //   };

  render() {
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
                  //onSubmit={this.handleSignUp}
                  onFinish={this.handleSignUp}
                  //onFinish={onFinish}
                  //action="auth/sign-up"
                  //method="POST"
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
                    <Input
                      placeholder="NUS email"
                      name="email"
                      addonAfter="@u.nus.edu"
                      value={this.state.email}
                      onChange={this.handleEmailChange}
                    />
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
                    <Input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={this.state.password}
                      onChange={this.handlePasswordChange}
                    />
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
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={this.state.confirmPassword}
                      onChange={this.handleConfirmPasswordChange}
                    />
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
                    <Input
                      placeholder="Username"
                      type="text"
                      name="username"
                      value={this.state.username}
                      onChange={this.handleConfirmUsernameChange}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      htmlType="submit"
                      type="primary"
                      //onClick={this.handleSignUp}
                      className="register-right-form-button"
                      //ghost
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
  }
}

export default Register;
