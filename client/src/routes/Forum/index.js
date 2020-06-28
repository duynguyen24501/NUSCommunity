import React from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { Empty, Form, Input, Button } from "antd";
import { UserAddOutlined, SearchOutlined } from "@ant-design/icons";
import "./index.css";

const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

export default class Forum extends React.Component {
  onFinish = (values) => {
    console.log(values);
  };

  render() {
    const forumList = sessionStorage.getItem("forumList")
      ? JSON.parse(sessionStorage.getItem("forumList"))
      : [];
    return (
      <div className="forum">
        <div className="forum-list">
          <div className="forum-list-title">DISCUSSIONS</div>
          {forumList.map((item) => (
            <div key={item.time} className="forum-list-item">
              <div className="forum-list-item-title">{item.title}</div>
              <div
                className="forum-list-item-msg"
                dangerouslySetInnerHTML={{ __html: item.msg }}
              />
              <div className="forum-list-item-user">
                <UserAddOutlined className="mr-8" />
                {item.user}
              </div>
              <div className="forum-list-item-bottom">
                {item.tags.map((res) => (
                  <div key={res} className="forum-list-item-bottom-tag">
                    {res}
                  </div>
                ))}
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
      </div>
    );
  }
}
