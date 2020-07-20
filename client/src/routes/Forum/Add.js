import React from "react";
import { message } from "antd";
import ForumForm from "./ForumForm";

export default class Add extends React.Component {
  onSubmit = (values) => {
    const { history } = this.props;
    const forumList = sessionStorage.getItem("forumList")
      ? JSON.parse(sessionStorage.getItem("forumList"))
      : [];
    // message.success("add success~");
    sessionStorage.setItem("forumList", JSON.stringify([...forumList, values]));

    fetch('/forum/add-post', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(res => {
      console.log(res.message);
      if (res.message === "Success") {
        message.success("Add post successfully!")
      } else {
        message.error("Fail to add post!")
      }
    })
    history.push("/index/forum");
  };

  render() {
    return <ForumForm data={{}} onSubmit={this.onSubmit} />;
  }
}
