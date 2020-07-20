import React from "react";
import { message } from "antd";
import { parse } from "qs";
import ForumForm from "./ForumForm";

export default class Edit extends React.Component {
  state = {
    data: {},
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
  }
  getPageQuery = () => parse(window.location.href.split("?")[1]);

  checkUser(data) {
    if (data.email) {
      fetch('/auth/check-session', {
        credentials: 'include'
      })
      .then(res => res.json())
      .then(response => {
        if (data.email !== response.email) {
          message.error('You are not allow to edit this post!')
          this.props.history.push('/index/forum');
        }
      })
    }
  }
  
  onSubmit = (values) => {
    const { history } = this.props;
    const forumList = sessionStorage.getItem("forumList")
      ? JSON.parse(sessionStorage.getItem("forumList"))
      : [];
    const list = [];
    forumList.forEach((item) => {
      if (Number(item.id) === Number(values.id)) {
        list.push(values);
      } else {
        list.push(item);
      }
    });
    //message.success("Edit post successfully!");
    sessionStorage.setItem("forumList", JSON.stringify(list));
    
    fetch('/forum/edit-post', {
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
        message.success("Edit post successfully!")
      } else {
        message.error("Fail to edit post!")
      }
      //onSubmit(params);
    })
    history.push("/index/forum");
  };

  render() {
    const { data } = this.state;
    this.checkUser(data);
    //console.log(data);
    if (!data.id) {
      return <div />;
    }
    return <ForumForm data={data} onSubmit={this.onSubmit} {...this.props} />;
  }
}
