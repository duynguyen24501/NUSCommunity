import React from "react";
import { message } from "antd";
import ForumForm from "./ForumForm";

export default class Add extends React.Component {
  onSubmit = (values) => {
    const { history } = this.props;
    const forumList = sessionStorage.getItem("forumList")
      ? JSON.parse(sessionStorage.getItem("forumList"))
      : [];
    message.success("add success~");
    sessionStorage.setItem("forumList", JSON.stringify([...forumList, values]));
    history.push("/index/forum");
  };

  render() {
    return <ForumForm data={{}} onSubmit={this.onSubmit} />;
  }
}
