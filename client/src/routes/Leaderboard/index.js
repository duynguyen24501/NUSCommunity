import React from "react";
// import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import { Table } from "antd";
import "./index.css";

export default class Leaderboard extends React.Component {
  state = {
    data: [],
  };
  componentDidMount() {
    this.getLeaderboardData();
  }

  getLeaderboardData() {
    fetch('/leaderboard/get-data', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(response => {
      this.setState({ data: response})
    })
  }

  render() {
    const dataSource = this.state.data;
    // [
    //   {
    //     key: "id1",
    //     name: "John Doe",
    //     num: 100,
    //     msg: "e3192322@u.nus.edu",
    //   },
    //   {
    //     key: "id2",
    //     name: "Harry White",
    //     num: 60,
    //     msg: "e12387213@u.nus.edu",
    //   },
    //   {
    //     key: "id3",
    //     name: "Mary Johnson",
    //     num: 30,
    //     msg: "e12371238@u.nus.edu",
    //   },
    // ];

    const columns = [
      {
        title: "#",
        dataIndex: "key",
        render: (text, record, index) => index + 1,
      },
      {
        title: "Username",
        dataIndex: "username",
      },
      {
        title: "Email",
        dataIndex: "email",
      },
      {
        title: "Contribution Points",
        dataIndex: "points",
      },
    ];
    return (
      <div className="leaderboard">
        <Table
          title={() => <h4 className="leaderboard-title">Ranking</h4>}
          className="leaderboard-table"
          dataSource={dataSource}
          columns={columns}
          bordered
          pagination={false}
        />
      </div>
    );
  }
}
