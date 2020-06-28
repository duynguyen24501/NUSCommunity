import React from "react";
import { Link } from "react-router-dom"
import Router from 'next/router'
//import Link from 'next/link'
import { Form, Input, Button, Row, Col } from "antd";
import icon from "../../assets/favicon.ico";
import "./index.css"
import Session from '../../utils/session'

/*
const onFinish = (values) => {
    console.log(values);
    alert("A verification link has been sent to your email");
    window.location.href = "/login";
  };
*/

class Register extends React.Component {
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
            username: '',
            message: null
        }
        this.handleEmailChange = this.handleEmailChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this)
        this.handleUsernameChange = this.handleUsernameChange.bind(this)
        this.handleSignUp = this.handleSignUp.bind(this)
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

    handleUsernameChange(event) {
        this.setState({
            username: event.target.value.trim()
        })
    }

    handleSignUp(event) {
        event.preventDefault()

        this.setState({
            message: null
        })

        if (!this.state.email || !this.state.password || !this.state.confirmPassword || !this.state.username) {
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
            username: this.state.username
        }

        fetch('auth/signup', {
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
        const alert = (this.state.message === null) ? <div /> : <div className="alert-style" role="alert">{this.state.message}</div>
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
                                        <Input placeholder="NUS email" name="email" addonAfter="@u.nus.edu" value={this.state.email} onChange={this.handleEmailChange} />
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
                                        <Input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange} />
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
                                        <Input type="password" name="confirmPassword" placeholder="Confirm Password" value={this.state.confirmPassword} onChange={this.handleConfirmPasswordChange} />
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
                                        <Input placeholder="Username" name="username" value={this.state.username} onChange={this.handleUsernameChange} />
                                    </Form.Item>
                                    {alert}
                                    <Form.Item>
                                        <Button
                                            type="submit"
                                            onClick={this.handleSignUp}
                                            className="register-right-form-button"
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
}

export default Register;
