import React from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { Empty, Form, Button, Modal, Tag } from "antd";
import {
  UserAddOutlined,
  EditOutlined,
} from "@ant-design/icons";
import "./index.css";

const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const colors = ["magenta", "orange", "cyan", "purple"];

export default class Home extends React.Component {

  state = {
    visible: false,
    data: { username: "", email: "", bio: "" },
    mostLikePost: [],
    //searchKey:"",
    posterEmail:""
  };

  componentDidMount() {
    this.getMostLikePost();
    this.getPosterEmail();
  }

  getPosterEmail() {
    fetch("/auth/check-session", {
      credentials: "include",
    })
    .then((res) => res.json())
    .then((response) => {
      this.setState({posterEmail: response.email})
    })
  }

  getMostLikePost() {
      fetch("/home/get-most-like-post", {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((response) => {
          console.log(response);
          var arr = [];
          for (var i = 0; i <response.length; i++) {
            //console.log("response: " + response[i]);
            arr.push(response[i].web_id);
          }
          //console.log("Arr: " + arr);
          this.setState({ mostLikePost: arr})
      });
  }

  onFinish = (values) => {
    //const {history} = this.props;
    console.log(values);
    // this.setState({
    //   searchKey: values.discussion,
    // })

    //history.push("/index/forum");
  };

  render() {
    var forumList = sessionStorage.getItem("forumList")
      ? JSON.parse(sessionStorage.getItem("forumList"))
      : [];
    //console.log("Check: " + this.state.mostLikePost);
    //if (this.state.searchKey !== ''){
     forumList = forumList.filter((item) => this.state.mostLikePost.includes(item.id));
    //}
    
    const { visible, data } = this.state;
    const layout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 16,
      },
    };

    return (
      // <div>
      //   <h1></h1>
      // </div>
      <div>
      <div className="forum">
        <div className="forum-list">
          <div className="forum-list-title-home">THE MOST LIKED POSTS</div>
          {forumList.map((item) => (
            //console.log(item),
            data.username = item.username, data.email = item.email, data.bio = item.bio,
            <div key={item.time} className="forum-list-item-home">
              <Link
                to={`/index/forum/info?id=${item.id}`}
                className="forum-list-item-title-home"
              >
                {item.title}
              </Link>
              <div className="forum-list-item-user-home">
                <UserAddOutlined className="mr-8 blue" />
                <span
                  onClick={() => {
                    this.setState({ visible: true });
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {item.username}
                </span>
              </div>
              <div className="forum-list-item-bottom-home">
                {item.tags.map((res, index) => (
                  <Tag key={res} color={colors[index % 4]}>
                    {res}
                  </Tag>
                ))}
                {this.state.posterEmail === item.email ? (
                  <Link
                  to={`/index/forum/edit?id=${item.id}`}
                  className="forum-list-item-bottom-edit"
                >
                  <EditOutlined /> edit
                </Link>
                ): (<div className="forum-list-item-bottom-edit"></div>)}
                <div className="forum-list-item-bottom-time">
                  {dayjs(item.time).fromNow()}
                </div>
              </div>
            </div>
          ))}
          {forumList.length ? null : (
            <Empty style={{ margin: 0 }} className="forum-list-item" />
          )}
        </div>
        {/* <div className="forum-add">
          <Form
            name="horizontal_forum"
            layout="inline"
            onFinish={this.onFinish}
            className="forum-add-form"
          >
            <Form.Item name="discussion">
              <Input placeholder="search discussion" />
            </Form.Item>
            <Form.Item className="forum-add-form-search">
              <Button
                type="primary"
                htmlType="submit"
                className="forum-button-search"
                icon={<SearchOutlined />}
              />
            </Form.Item>
          </Form>
          <Button
            type="primary"
            href="/index/forum/add"
            className="forum-add-btn"
          >
            New Discussion
          </Button>
        </div> */}
        <Modal
          visible={visible}
          title="User Info"
          className="modal-user-display"
          onCancel={() => {
            this.setState({ visible: false });
          }}
          footer={null}
        >
          <Form {...layout}>
            <Form.Item label="Name">{data.username}</Form.Item>
            <Form.Item label="Email">{data.email}</Form.Item>
            <Form.Item label="Bio">{data.bio}</Form.Item>
          </Form>
        </Modal>
      </div>
      <div className="under-forum-home">
        <Button className="under-forum-button-home"><Link to="/index/forum">See More</Link></Button>
      </div>
      </div>
    );
  }
}

