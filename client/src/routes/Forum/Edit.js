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
    message.success("edit success~");
    sessionStorage.setItem("forumList", JSON.stringify(list));
    history.push("/index/forum");
  };

  render() {
    const { data } = this.state;
    //console.log(data);
    if (!data.id) {
      return <div />;
    }
    return <ForumForm data={data} onSubmit={this.onSubmit} {...this.props} />;
  }
}
