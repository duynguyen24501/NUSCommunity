import React from "react";
import {withRouter} from "react-router-dom";
import BraftEditor from "braft-editor";
import dayjs from "dayjs";
import { Form, Input, message } from "antd";
import { PlusCircleFilled, CloseOutlined } from "@ant-design/icons";
import "braft-editor/dist/index.css";
import "./index.css";

const controls = ["bold", "italic", "headings", "text-color", "emoji"];

class ForumForm extends React.Component {
  formRef = React.createRef();

  constructor(props) {
    super(props)
    this.state = {
      tags: [],
      tag: "",
      email:"",
      username: "",
      bio:""
    };
  }

  componentDidMount() {
    const { data } = this.props;
    if (data.id) {
      this.setState({
        tags: data.tags,
      });
    }
    this.getUserData();
  }

  getUserData() {
    fetch('/auth/check-session', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(response => {
      if (!response.loggedin) {
        message.error('Please register and login first to access!')
        this.props.history.push('/')
      }
      this.setState({
        email: response.email,
        username: response.username,
        bio: response.bio
      })
    })
  }

  onFinish = (values) => {
    const { tags } = this.state;
    const { onSubmit, data } = this.props;
    if (!tags.length) {
      message.error("please enter your tag name");
      return;
    }
    const params = {
      id: data.id ? data.id : dayjs().valueOf(),
      title: values.title,
      msg: values.msg.toHTML(),
      email: this.state.email,
      username: this.state.username,
      bio: this.state.bio,
      time:dayjs().valueOf(),
      //time: dayjs.format('YYYY-MM-DD hh:mm:ss'),
      tags: this.state.tags
    };
    onSubmit(params);
  };

  addTag = () => {
    const { tags, tag } = this.state;
    if (!tag) {
      message.error("please enter your tag name");
      return;
    }
    this.setState({
      tags: [...tags, tag],
      tag: "",
    });
  };

  removeTag = (name) => {
    const { tags } = this.state;
    const data = [];
    tags.forEach((item) => {
      if (item !== name) {
        data.push(item);
      }
    });
    this.setState({
      tags: data,
    });
  };

  remove = () => {
    const { data, history } = this.props;
    const forumList = sessionStorage.getItem("forumList")
      ? JSON.parse(sessionStorage.getItem("forumList"))
      : [];
    //message.success("delete success~");
    sessionStorage.setItem(
      "forumList",
      JSON.stringify(
        forumList.filter((item) => {
          return Number(item.id) !== Number(data.id);
        })
      )
    );

    fetch('/forum/delete-post', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(res => {
      console.log(res.message);
      if (res.message === "Success") {
        message.success("Delete post successfully!")
      } else {
        message.error("Fail to delete post!")
      }
      history.push("/index/forum");
    })
  };

  render() {
    const { data } = this.props;
    const { tags, tag } = this.state;
    return (
      <div className="forumForm">
        <Form
          name="normal_add"
          ref={this.formRef}
          className="forumForm-form"
          onFinish={this.onFinish}
          initialValues={{
            title: data.title,
            msg: BraftEditor.createEditorState(data.msg || ""),
          }}
        >
          <Form.Item
            name="title"
            rules={[
              {
                required: true,
                message: "please enter your title!",
              },
            ]}
          >
            <Input placeholder="Discussion title" />
          </Form.Item>
          <Form.Item>
            <span className="forumForm-form-tag-msg">Tags：</span>
            {tags.map((item) => (
              <div key={item} className="forumForm-form-tag-item">
                {item}
                <CloseOutlined
                  onClick={() => this.removeTag(item)}
                  className="forumForm-form-tag-item-remove"
                />
              </div>
            ))}
            <Input
              value={tag}
              onChange={(e) => this.setState({ tag: e.target.value })}
              className="forumForm-form-tag-input"
              placeholder="tag name..."
            />
            <PlusCircleFilled
              onClick={() => this.addTag()}
              className="forumForm-form-tag-icon"
            />
          </Form.Item>
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
            <BraftEditor
              language="en"
              className="my-editor"
              controls={controls}
              placeholder="Discussion summary..."
            />
          </Form.Item>
          <div
            onClick={() => {
              this.formRef.current.submit();
            }}
            className={data.id ? "forumForm-form-btn" : "forumForm-form-btn-2"}
          >
            Post
          </div>
          {data.id && (
            <div
              onClick={() => {
                this.remove();
              }}
              className="forumForm-form-btn-del"
            >
              Delete
            </div>
          )}
        </Form>
      </div>
    );
  }
}

export default withRouter(ForumForm);