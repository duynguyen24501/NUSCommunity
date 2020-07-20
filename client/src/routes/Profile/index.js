import React from "react";
import { Link } from "react-router-dom";
import {
  // UserOutlined,
  ArrowLeftOutlined,
  LockOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Form, message, Input, Button } from "antd";
import BraftEditor from "braft-editor";
import "braft-editor/dist/index.css";
import "./index.css";
import "./index.css";

export default class Profile extends React.Component {
  formRef = React.createRef();

  constructor(props) {
    super(props)
    this.state = {
      loggedin: false,
      email:'',
      username: '',
      points: '',
      bio:'',
      message: ''
    }
    this.handleBioChange =  this.handleBioChange.bind(this)
    this.handleProfile = this.handleProfile.bind(this)
    this.deleteAccount = this.deleteAccount.bind(this)
  }

  async componentDidMount() {
    this.getProfile()
  }

  getProfile() {
    fetch('/auth/check-session', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(response => {
      if (!response.loggedin) return;
      this.setState({
        loggedin: response.loggedin,
        email: response.email,
        username: response.username,
        points: response.points,
        bio: response.bio
      })
    })
  }

  deleteAccount() {
    console.log('Account deleted successfully triggers here!')
    fetch('/auth/deleteAccount', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(response => {
      this.setState({
        message: response.message
      })
      const { history } = this.props;
      //window.location("/");
      message.success(this.state.message);
      history.push("/");
    })
  }

  handleBioChange(event) {
    this.setState({
      bio: event.target.value
    })
  }

  handleProfile(event) {
    event.preventDefault()
    this.setState({
      bio:'',
      message: null
    })
  
    const data = {
      bio: this.state.bio
    }
    //console.log(this.state.bio);
    fetch('/auth/updateProfile', {
      method: 'POST',
      body: JSON.stringify(data),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(async res => {
      if (res.status === 200) {
        this.getProfile()
        this.setState({
          message: 'Profile have been saved!'
        })
        message.success(this.state.message);
      } else {
        this.setState({
          message: 'Failed to save profile. Please try again!'
        })
        message.error(this.state.message)
      }
    })
  }

  // state = {
  //   info: {
  //     name: "abc",
  //     email: "e12398132@u.nus.edu",
  //     bio: "",
  //   },
  // };

  onFinish = (values) => {
    // console.log(values);
  };

  render() {
    const { history } = this.props;
    //const { info } = this.state;
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
          <div className="profile-center-del" onClick={this.deleteAccount}>
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
              bio: BraftEditor.createEditorState(this.state.bio),
            }}
          >
            <div className="profile-con-form-label">Name</div>
            <Form.Item>{this.state.username}</Form.Item>
            <div className="profile-con-form-label">Email</div>
            <Form.Item>{this.state.email}</Form.Item>
            <div className="profile-con-form-label">Contribution Points</div>
            <Form.Item>{this.state.points}</Form.Item>
            <div className="profile-con-form-label">Bio</div>
            <Form.Item>
              <Input type="text" placeholder="Bio" name="bio" id="bio" value={this.state.bio} onChange={this.handleBioChange}></Input>
            </Form.Item>
            {/* <Form.Item
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
            </Form.Item> */}
            {/* <div
              onClick={() => {
                this.formRef.current.submit();
              }}
              className="profile-con-form-btn"
            >
              Save
            </div> */}
            <Button
              type="submit"
              onClick={this.handleProfile}
              size="large"
            >
              Save
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}
