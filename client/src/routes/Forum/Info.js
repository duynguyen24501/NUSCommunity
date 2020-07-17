import React from "react";
import dayjs from "dayjs";
import { message, Form } from "antd";
import BraftEditor from "braft-editor";
import {
  UserAddOutlined,
  DeleteOutlined,
  LikeOutlined,
  // HeartOutlined,
} from "@ant-design/icons";
import { parse } from "qs";
import "braft-editor/dist/index.css";

const controls = ["bold", "italic", "headings", "text-color", "emoji"];

export default class Info extends React.Component {
  formRef = React.createRef();

  state = {
    data: {},
    comment: [
      {
        comment_web_id: dayjs().valueOf(),
        time: dayjs().valueOf(),
        username: "abc",
        value: "<div>111</div>",
      },
    ],
    like: false,
    favorite: false,
    userComment:'',
  };

  componentDidMount() {
    const query = this.getPageQuery();
    const forumList = sessionStorage.getItem("forumList")
      ? JSON.parse(sessionStorage.getItem("forumList"))
      : [];
    this.setState({
      data: forumList.find((item) => {
        return Number(item.id) === Number(query.id);
      }),
    });
    setTimeout(() => {
      this.formRef.current.setFieldsValue({
        comment: BraftEditor.createEditorState(""),
      });
    }, 100);
    this.getUserComment();
  }

  getUserComment() {
    fetch('/auth/check-session', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(response => {
      this.state.userComment = response.username;
    })
  }

  getPageQuery = () => parse(window.location.href.split("?")[1]);

  remove = () => {
    const { history } = this.props;
    const query = this.getPageQuery();
    const forumList = sessionStorage.getItem("forumList")
      ? JSON.parse(sessionStorage.getItem("forumList"))
      : [];
    message.success("delete success~");
    sessionStorage.setItem(
      "forumList",
      JSON.stringify(
        forumList.filter((item) => {
          return Number(item.id) !== Number(query.id);
        })
      )
    );
    history.push("/index/forum");
  };

  onFinish = (values) => {
    const { comment } = this.state;
    this.formRef.current.setFieldsValue();

    const comment_web_id = dayjs().valueOf();
    const time = dayjs().valueOf();
    
    this.setState({
      comment: [
        ...comment,
        {
          comment_web_id: comment_web_id,
          time: time,
          username: this.state.userComment,
          value: values.comment.toHTML(),
        },
      ],
    });

    const params = {
      post_web_id: this.state.data.id,
      comment_web_id: comment_web_id,
      username: this.state.userComment,
      value: values.comment.toHTML(),
      time: time,
    } 

    fetch('/forum/add-comment', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(res => {
      console.log(res.message);
      if (res.message == "Success") {
        message.success("Add comment successfully!")
      } else {
        message.error("Fail to add comment!")
      }
    })

    this.formRef.current.setFieldsValue({
      comment: BraftEditor.createEditorState(""),
    });
  };

  removeComment = (id) => {
    const { comment } = this.state;
    //message.success("delete success~");

    const post_web_id = this.state.data.id;
    const params = {
      post_web_id: post_web_id,
      comment_web_id: id,
    }

    if (this.state.data.username === this.state.userComment) {
      this.setState({
        comment: comment.filter((item) => {
          return Number(item.comment_web_id) !== id;
        }),
      });

      fetch('/forum/delete-comment', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(res => {
          console.log(res.message);
          if (res.message == "Success") {
            message.success("Delete comment successfully!")
          } else {
            message.error("Fail to delete post!")
          }
      })
    } else {
      message.error("You are not allowed to delete comment!");
    }
  };

  render() {
    const { data, favorite, like, comment } = this.state;
    if (!data.id) {
      return <div />;
    }
    return (
      <div className="forumInfo">
        <div className="forumInfo-data">
          <div className="forumInfo-data-user">
            <UserAddOutlined className="mr-8" />
            {data.username}
            <div className="forumInfo-data-user-time">
              {dayjs(data.time).fromNow()}
            </div>
          </div>
          <div className="forumInfo-data-title">{data.title}</div>
          <div
            className="forumInfo-data-msg"
            dangerouslySetInnerHTML={{ __html: data.msg }}
          />
          <div className="forumInfo-data-bottom">
            {data.tags.map((res) => (
              <div key={res} className="forumInfo-data-bottom-tag">
                {res}
              </div>
            ))}
            <div className="forumInfo-data-bottom-blank" />
            <LikeOutlined
              onClick={() => {
                this.setState({ like: !like });
              }}
              className={`forumInfo-data-bottom-icon ${like ? "red" : ""}`}
            />
            {/* <HeartOutlined
              onClick={() => {
                this.setState({ favorite: !favorite });
              }}
              className={`forumInfo-data-bottom-icon ${favorite ? "red" : ""}`}
            />
            <DeleteOutlined
              onClick={this.remove}
              className="forumInfo-data-bottom-icon"
            /> */}
          </div>
        </div>
        <div className="forumInfo-comment">
          <Form
            name="normal_comment"
            ref={this.formRef}
            className="forumInfo-comment-form"
            onFinish={this.onFinish}
          >
            <Form.Item
              name="comment"
              validateTrigger="onBlur"
              rules={[
                {
                  validator(rule, value) {
                    if (value.isEmpty()) {
                      return Promise.reject("please enter your opinion");
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
                placeholder="Your opinion..."
              />
            </Form.Item>
            <div
              onClick={() => {
                this.formRef.current.submit();
              }}
              className="forumInfo-comment-form-btn"
            >
              Reply
            </div>
          </Form>
        </div>
        <div className="forumInfo-commentList">
          {comment.map((item) => (
            <div key={item.comment_web_id} className="forumInfo-commentList-item">
              <div className="forumInfo-commentList-item-header">
                <div className="forumInfo-commentList-item-header-user">
                  <UserAddOutlined className="mr-8" />
                  {item.username}
                </div>
                <div className="forumInfo-commentList-item-header-time">
                  {dayjs(item.time).fromNow()}
                </div>
              </div>
              <div
                className="forumInfo-commentList-item-con"
                dangerouslySetInnerHTML={{ __html: item.value }}
              />
              <DeleteOutlined
                onClick={() => this.removeComment(item.comment_web_id)}
                className="forumInfo-commentList-item-del"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}
