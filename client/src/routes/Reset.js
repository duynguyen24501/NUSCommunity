import React from "react";
import { Link } from "react-router-dom";
import Router from 'next/router'
import { Form, Input, Button, Row, Col } from "antd";
import icon from "../assets/favicon.ico";
import "../css/Reset.css";
import Session from '../utils/session';


  // const onFinish = (values) => {
  //   console.log(values);
  //   alert("A verification link has been sent to your email");
  //   window.location.href = "/login";
  // };
class Reset extends React.Component {
  static async getInitialProps({ req, res }) {

    let props = {
        session: ''
    }

    if (req && req.session) {
        props.session = req.session
    } else {
        props.session = await Session.getSession()
    }

    if (props.session && props.session.loggedin) {
        if (req) {
            res.redirect('/')
        } else {
            Router.push('/')
        }
    }

    return props
  }
  constructor(props) {
    super(props)
    this.state = {
        email: '',
        password: '',
        confirmPassword: '',
        message: null
    }
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this)
    this.handleReset = this.handleReset.bind(this)
}

  handleEmailChange(event) {
    this.setState({
        email: event.target.value.trim()
    })
  }

  handlePasswordChange(event) {
    this.setState({
        password: event.target.value.trim()
    })
  }

  handleConfirmPasswordChange(event) {
    this.setState({
        confirmPassword: event.target.value.trim()
    })
  }

  handleReset(event) {
    event.preventDefault()
    
    this.setState({
        message: null
    })

    if (!this.state.email || !this.state.password || !this.state.confirmPassword) {
        this.setState({
            message: 'All fields are required!'
        })

        return
    }

    if (this.state.password !== this.state.confirmPassword) {
        this.setState({
            message: 'Password did not match!'
        })

        return
    }

    let data = {
        email: this.state.email,
        password: this.state.password,
    }

    console.log(this.state.email + " " + this.state.password);

    fetch('auth/reset', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(response => {
        if (response.message) {
            this.setState({
                message: response.message
            })
        } else if (response.email) {
            this.setState({
              message: "A verification link has been sent to " + response.email
            })
            //alert("A verification link has been sent to " + response.email);
            //Router.push('/check-email?email=' + response.email)
        } else {
            this.setState({
                message: 'Unknown Error!'
            })
        }
    })
    .catch(error => {
        console.error('Error:', error)
        this.setState({
            message: 'Request Failed!'
        })
    })
}

  
  render() {
    const alert = (this.state.message === null) ? <div/> : <div className="alert-style" role="alert">{this.state.message}</div>
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
                  <Input placeholder="NUS email" name="email" addonAfter="@u.nus.edu" value={this.state.email} onChange={this.handleEmailChange}/>
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
                  <Input type="password" name="password" placeholder="New Password" value={this.state.password} onChange={this.handlePasswordChange}/>
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
                  <Input type="password" name="confirmPassword" placeholder="Confirm New Password" value={this.state.confirmPassword} onChange={this.handleConfirmPasswordChange} />
                </Form.Item>
                {alert}
                <Form.Item>
                  <Button
                    type="submit"
                    onClick={this.handleReset}
                    className="reset-right-form-button"
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
    )};
}

export default Reset;
