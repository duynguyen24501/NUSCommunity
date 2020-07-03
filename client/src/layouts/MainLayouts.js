import React from "react";
import { Route, Switch, Redirect, Link, withRouter } from "react-router-dom";
import { Menu, Dropdown } from "antd";
import {
  DownOutlined,
  UserOutlined,
  LogoutOutlined,
  EditOutlined,
} from "@ant-design/icons";
import Home from "../routes/Home/Home.js";
import Keep from "../routes/Keep";
import Leaderboard from "../routes/Leaderboard";
import Profile from "../routes/Profile";
import Forum from "../routes/Forum";
import ForumAdd from "../routes/Forum/Add";
import ForumEdit from "../routes/Forum/Edit";
import ForumInfo from "../routes/Forum/Info";
import icon from "../assets/favicon.ico";
import "./MainLayouts.css";

class MainLayouts extends React.Component {
  render() {
    const { location } = this.props;
    const menu = (
      <Menu>
        <Menu.Item>
          <Link to="/login">
            <LogoutOutlined className="mr-8" /> Logout
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/index/profile">
            <EditOutlined className="mr-8" /> Edit Profile
          </Link>
        </Menu.Item>
      </Menu>
    );
    const navList = [
      {
        name: "Home",
        link: "/index/home",
      },
      {
        name: "Keep",
        link: "/index/keep",
      },
      {
        name: "Forum",
        link: "/index/forum",
      },
      {
        name: "Leaderboard",
        link: "/index/leaderboard",
      },
    ];
    return (
      <div className="main">
        <div className="main-header">
          <img src={icon} alt="" />
          <span className="main-header-title">NUSCommunity</span>
          <Dropdown overlay={menu}>
            <span className="main-header-user">
              <UserOutlined className="mr-8" />
              abc <DownOutlined />
            </span>
          </Dropdown>
        </div>
        <div className="main-nav">
          {navList.map((item) => (
            <div
              key={item.link}
              className={`main-nav-item ${
                location.pathname === item.link ? "main-nav-item-select" : ""
              }`}
            >
              <Link to={item.link}>{item.name}</Link>
            </div>
          ))}
        </div>
        <>
          <Switch>
            <Route path={"/index/forum/edit"} component={ForumEdit} />
            <Route path={"/index/forum/add"} component={ForumAdd} />
            <Route path={"/index/forum/info"} component={ForumInfo} />
            <Route path={"/index/forum"} component={Forum} />
            <Route path={"/index/home"} component={Home} />
            <Route path={"/index/keep"} component={Keep} />
            <Route path={"/index/leaderboard"} component={Leaderboard} />
            <Route path={"/index/profile"} component={Profile} />
            <Redirect from="/index" to={"/index/home"} />
          </Switch>
        </>
      </div>
    );
  }
}
export default withRouter(MainLayouts);
