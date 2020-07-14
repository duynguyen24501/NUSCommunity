import React from "react";
import { Route, Switch, Redirect, Link, withRouter } from "react-router-dom";
import { Menu, Dropdown, message } from "antd";
import {
  DownOutlined,
  UserOutlined,
  LogoutOutlined,
  EditOutlined,
} from "@ant-design/icons";
import Home from "../routes/Home";
import Keep from "../routes/Keep";
import Leaderboard from "../routes/Leaderboard";
import Profile from "../routes/Profile";
import Forum from "../routes/Forum";
import ForumAdd from "../routes/Forum/Add";
import ForumEdit from "../routes/Forum/Edit";
import ForumInfo from "../routes/Forum/Info";
import Weather from "../routes/Weather";
import icon from "../assets/favicon.ico";
import "./MainLayouts.css";

class MainLayouts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedin: false,
      username: "",
    };
  }

  async componentDidMount() {
    // this.getProfile()
  }

  getProfile() {
    fetch("/auth/check-session", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((response) => {
        const { history } = this.props;
        if (!response.loggedin) {
          message.error("Please register and login first to access!");
          history.push("/");
        }
        this.setState({
          loggedin: response.loggedin,
          username: response.username,
        });
        //console.log(this.state.loggedin);
        //console.log(this.state.username);
      });
  }

  render() {
    const { location, history } = this.props;
    const menu = (
      <Menu>
        <Menu.Item>
          <Link to="/callback">
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
        name: "Weather App",
        link: "/index/weather",
      },
      {
        name: "Leaderboard",
        link: "/index/leaderboard",
      },
    ];
    //if (this.state.loggedin) {
    return (
      <div className="main">
        <div className="main-header">
          <img src={icon} alt="" />
          <span className="main-header-title">NUSCommunity</span>
          <Dropdown overlay={menu}>
            <span className="main-header-user">
              <UserOutlined className="mr-8" />
              {this.state.username}
              <DownOutlined />
            </span>
          </Dropdown>
        </div>
        <Menu
          onClick={(e) => {
            history.push(e.key);
          }}
          selectedKeys={[location.pathname]}
          mode="horizontal"
          className="main-menu"
        >
          {navList.map((item) => (
            <Menu.Item key={item.link}>{item.name}</Menu.Item>
          ))}
        </Menu>
        <>
          <Switch>
            <Route path={"/index/forum/edit"} component={ForumEdit} />
            <Route path={"/index/forum/add"} component={ForumAdd} />
            <Route path={"/index/forum/info"} component={ForumInfo} />
            <Route path={"/index/forum"} component={Forum} />
            <Route path={"/index/home"} component={Home} />
            <Route path={"/index/keep"} component={Keep} />
            <Route path={"/index/leaderboard"} component={Leaderboard} />
            <Route path={"/index/weather"} component={Weather} />
            <Route path={"/index/profile"} component={Profile} />
            <Redirect from="/index" to={"/index/home"} />
          </Switch>
        </>
      </div>
    );
    //   } else {
    //     return (
    //       <div>Please Register and Login first!</div>
    //     )
    //  }
  }
}
export default withRouter(MainLayouts);
