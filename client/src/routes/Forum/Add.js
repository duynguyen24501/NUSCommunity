import React from "react";
import BraftEditor from "braft-editor";
import dayjs from "dayjs";
import { Form, Input, message } from "antd";
import { PlusCircleFilled, CloseOutlined } from "@ant-design/icons";
import "braft-editor/dist/index.css";
import "./index.css";

const controls = ["bold", "italic", "headings", "text-color", "emoji"];

export default class Forum extends React.Component {
  formRef = React.createRef();

  state = {
    tags: [],
    tag: "",
  };

  componentDidMount() {
    this.formRef.current.setFieldsValue({
      msg: BraftEditor.createEditorState(""),
    });
  }

  onFinish = (values) => {
    const { tags } = this.state;
    const { history } = this.props;
    if (!tags.length) {
      message.error("please enter your tag name");
      return;
    }
    const params = {
      title: values.title,
      msg: values.msg.toHTML(),
      user: "admin",
      time: dayjs().valueOf(),
      tags,
    };
    const forumList = sessionStorage.getItem("forumList")
      ? JSON.parse(sessionStorage.getItem("forumList"))
      : [];
    message.success("add success~");
    sessionStorage.setItem("forumList", JSON.stringify([...forumList, params]));
    history.push("/index/forum");
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

  render() {
    const { tags, tag } = this.state;
    return (
      <div className="forum">
        <Form
          name="normal_add"
          ref={this.formRef}
          className="forum-form"
          onFinish={this.onFinish}
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
            <span className="forum-form-tag-msg">Tags：</span>
            {tags.map((item) => (
              <div key={item} className="forum-form-tag-item">
                {item}
                <CloseOutlined
                  onClick={() => this.removeTag(item)}
                  className="forum-form-tag-item-remove"
                />
              </div>
            ))}
            <Input
              value={tag}
              onChange={(e) => this.setState({ tag: e.target.value })}
              className="forum-form-tag-input"
              placeholder="tag name..."
            />
            <PlusCircleFilled
              onClick={() => this.addTag()}
              className="forum-form-tag-icon"
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
            className="forum-form-btn"
          >
            Post Discussion
          </div>
        </Form>
      </div>
    );
  }
}
