import React from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { Empty, Form, Input, Button, Modal } from "antd";
import {
  UserAddOutlined,
  SearchOutlined,
  EditOutlined,
} from "@ant-design/icons";
import "./index.css";

const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

export default class Forum extends React.Component {
  state = {
    visible: false,
    data: { name: "abc", email: "e12398132@u.nus.edu", bio: "some bio" },
  };
  onFinish = (values) => {
    console.log(values);
  };

  render() {
    const forumList = sessionStorage.getItem("forumList")
      ? JSON.parse(sessionStorage.getItem("forumList"))
      : [];
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
      <div className="forum">
        <div className="forum-list">
          <div className="forum-list-title">DISCUSSIONS</div>
          {forumList.map((item) => (
            <div key={item.time} className="forum-list-item">
              <Link
                to={`/index/forum/info?id=${item.id}`}
                className="forum-list-item-title"
              >
                {item.title}
              </Link>
              <div className="forum-list-item-user">
                <UserAddOutlined className="mr-8" />
                <span
                  onClick={() => {
                    this.setState({ visible: true });
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {item.user}
                </span>
              </div>
              <div className="forum-list-item-bottom">
                {item.tags.map((res) => (
                  <div key={res} className="forum-list-item-bottom-tag">
                    {res}
                  </div>
                ))}
                <Link
                  to={`/index/forum/edit?id=${item.id}`}
                  className="forum-list-item-bottom-edit"
                >
                  <EditOutlined /> edit
                </Link>
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
        <div className="forum-add">
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
                icon={<SearchOutlined />}
              />
            </Form.Item>
          </Form>
          <Link to="/index/forum/add" className="forum-add-btn">
            New Discussion
          </Link>
        </div>
        <Modal
          visible={visible}
          title="User Info"
          onCancel={() => {
            this.setState({ visible: false });
          }}
          footer={null}
        >
          <Form {...layout}>
            <Form.Item label="Name">{data.name}</Form.Item>
            <Form.Item label="Email">{data.email}</Form.Item>
            <Form.Item label="Bio">{data.bio}</Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
