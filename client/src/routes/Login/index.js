import React from "react";
import { Link } from "react-router-dom";
import Router from 'next/router'
import { Form, Input, Button, message} from "antd";
import icon from "../../assets/favicon.ico";
import "./index.css";
import Session from '../../utils/session';

// const onFinish = (values) => {
//   console.log(values);
//   message.success("login success~");
//   window.location.href = "/home";
// };

class Login extends React.Component {
  static async getInitialProps({req, res}) {
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
      message: null
    }
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
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
  
  handleLogin(event) {
    event.preventDefault()

    this.setState({
      message: null
    })

    if (!this.state.email || !this.state.password) {
      this.setState({
        message: 'Email/Password is empty!'
      })

      return
    }

    let data = {
      email: this.state.email,
      password: this.state.password
    }

    fetch('auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(response => {
      if (response.loggedin) {
        //message.success("login success~");
        //window.location.href = "/index";
        const { history } = this.props;
        message.success("login success~");
        history.push("/index");
        //response.redirect('/home');
        //Router.push(`/`)
      } else if (response.message) {

        this.setState({
           message: response.message
        })
        //alert(response.message);
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
        <div style={{ paddingTop: 25 }}>
          <div className="login">
            <div className="login-title">Welcome to the NUSCommunity !</div>
            <div className="login-con">
              <img className="login-con-img" src={icon} alt="" />
              <div className="login-con-line" />
              <Form
                name="normal_login"
                className="login-con-form"
                // onFinish={this.onFinish}
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
                  <Input placeholder="Email" name="email" value={this.state.email} onChange={this.handleEmailChange}/>
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
                  <Input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange}/>
                </Form.Item>
                <Form.Item>
                  <Link className="login-con-form-reset" to="/reset">
                    forgot password?
                  </Link>
                </Form.Item>
                
                <Form.Item>
                  <Button
                    type="submit"
                    onClick={this.handleLogin}
                    className="login-con-form-btn"
                    size="large"
                  >
                    SIGN IN
                  </Button>
                  {alert}
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
}
export default Login;
